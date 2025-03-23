import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { App } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Voucher, VoucherFormData } from '../types'
import { 
  getVouchers, 
  getVoucherById, 
  getVoucherByCode,
  createVoucher, 
  updateVoucher, 
  deleteVoucher,
  redeemVoucher as redeemVoucherAPI
} from '../services/voucherService'

// Query keys
const VOUCHERS_QUERY_KEY = 'vouchers'
const VOUCHER_DETAIL_QUERY_KEY = 'voucher-detail'
const VOUCHER_BY_CODE_KEY = 'voucher-by-code'

// Define state interface
interface VoucherState {
  selectedVoucher: Voucher | null;
  currentVoucher: Voucher | null; // For redemption flow
  loading: boolean;
  submitting: boolean;
  error: string | null; // For tracking errors in redemption flow
}

export const useVouchers = () => {
  const { notification } = App.useApp();
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [paginationParams, setPaginationParams] = useState({
    current: 1,
    pageSize: 10,
    sort: ''
  })
  
  const [state, setState] = useState<VoucherState>({
    selectedVoucher: null,
    currentVoucher: null, // For redemption flow
    loading: false,
    submitting: false,
    error: null // For tracking errors in redemption flow
  })

  // Fetch vouchers list with pagination
  const { 
    data: vouchersData,
    isLoading,
    isError,
    error: vouchersError
  } = useQuery({
    queryKey: [VOUCHERS_QUERY_KEY, paginationParams],
    queryFn: () => getVouchers(
      paginationParams.current,
      paginationParams.pageSize,
      paginationParams.sort
    ),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60000, // 1 minute
  })

  // Handle error display for the vouchers query
  if (isError && vouchersError) {
    notification.error({
      message: 'Error fetching vouchers',
      description: (vouchersError as Error).message
    })
  }

  // Fetch voucher by ID
  const fetchVoucherById = useCallback(async (id: string) => {
    try {
      setState((prev: VoucherState) => ({ ...prev, loading: true, error: null }));
      const voucher = await getVoucherById(id);
      setState((prev: VoucherState) => ({ ...prev, selectedVoucher: voucher, loading: false }));
      return voucher;
    } catch (error) {
      console.error('Error fetching voucher by ID:', error);
      setState((prev: VoucherState) => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch voucher', 
        loading: false 
      }));
      return null;
    }
  }, []);

  // Fetch voucher by code (for redemption)
  const fetchVoucherByCode = useCallback(async (code: string) => {
    try {
      setState((prev: VoucherState) => ({ ...prev, loading: true, error: null }));
      const voucher = await getVoucherByCode(code);
      setState((prev: VoucherState) => ({ ...prev, currentVoucher: voucher, loading: false }));
      return voucher;
    } catch (error) {
      console.error('Error fetching voucher by code:', error);
      setState((prev: VoucherState) => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch voucher', 
        loading: false 
      }));
      return null;
    }
  }, []);

  // Redeem voucher
  const redeemVoucherFn = useCallback(async (code: string) => {
    try {
      setState((prev: VoucherState) => ({ ...prev, submitting: true, error: null }));
      const success = await redeemVoucherAPI(code);
      
      // Only update if redemption was successful and we have the current voucher
      if (success && state.currentVoucher) {
        const updatedVoucher = {
          ...state.currentVoucher,
          status: 'redeemed' as 'redeemed',
          isRedeemed: true,
          redeemedAt: new Date().toISOString()
        };
        
        setState((prev: VoucherState) => ({ 
          ...prev, 
          currentVoucher: updatedVoucher, 
          submitting: false 
        }));
        
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: [VOUCHERS_QUERY_KEY] });
        if (state.currentVoucher.id) {
          queryClient.invalidateQueries({ 
            queryKey: [VOUCHER_DETAIL_QUERY_KEY, state.currentVoucher.id] 
          });
        }
        queryClient.invalidateQueries({ 
          queryKey: [VOUCHER_BY_CODE_KEY, code]
        });
        
        return updatedVoucher;
      }
      
      setState((prev: VoucherState) => ({ ...prev, submitting: false }));
      return state.currentVoucher;
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      setState((prev: VoucherState) => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to redeem voucher', 
        submitting: false 
      }));
      return null;
    }
  }, [queryClient, state.currentVoucher]);

  // Create voucher mutation
  const createVoucherMutation = useMutation({
    mutationFn: (voucherData: VoucherFormData) => createVoucher(voucherData),
    onMutate: () => {
      setState((prev: VoucherState) => ({ ...prev, submitting: true }))
    },
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Voucher created successfully'
      })
      setState((prev: VoucherState) => ({ ...prev, submitting: false }))
      router.push('/dashboard/vouchers')
      return queryClient.invalidateQueries({ queryKey: [VOUCHERS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error creating voucher',
        description: error.message
      })
      setState((prev: VoucherState) => ({ ...prev, submitting: false }))
    }
  })

  // Update voucher mutation
  const updateVoucherMutation = useMutation({
    mutationFn: ({ id, voucherData }: { id: string; voucherData: VoucherFormData }) => 
      updateVoucher(id, voucherData),
    onMutate: () => {
      setState((prev: VoucherState) => ({ ...prev, submitting: true }))
    },
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Voucher updated successfully'
      })
      setState((prev: VoucherState) => ({ ...prev, submitting: false }))
      router.push('/dashboard/vouchers')
      return queryClient.invalidateQueries({ queryKey: [VOUCHERS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error updating voucher',
        description: error.message
      })
      setState((prev: VoucherState) => ({ ...prev, submitting: false }))
    }
  })

  // Delete voucher mutation
  const deleteVoucherMutation = useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Voucher deleted successfully'
      })
      return queryClient.invalidateQueries({ queryKey: [VOUCHERS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error deleting voucher',
        description: error.message
      })
    }
  })

  // Handle table pagination change
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const sort = sorter.order 
      ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}`
      : '';
    
    setPaginationParams({
      current: pagination.current,
      pageSize: pagination.pageSize,
      sort
    })
  }

  // Handle voucher creation
  const handleCreateVoucher = async (voucherData: VoucherFormData) => {
    createVoucherMutation.mutate(voucherData)
  }

  // Handle voucher update
  const handleUpdateVoucher = async (id: string, voucherData: VoucherFormData) => {
    updateVoucherMutation.mutate({ id, voucherData })
  }

  // Handle voucher deletion
  const handleDeleteVoucher = async (id: string) => {
    deleteVoucherMutation.mutate(id)
  }

  return {
    vouchers: vouchersData?.data || [],
    selectedVoucher: state.selectedVoucher,
    currentVoucher: state.currentVoucher, // For redemption flow
    loading: isLoading || state.loading,
    submitting: state.submitting,
    error: state.error, // For redemption flow
    pagination: {
      current: paginationParams.current,
      pageSize: paginationParams.pageSize,
      total: vouchersData?.pagination?.total || 0
    },
    fetchVoucherById,
    getVoucherByCode: fetchVoucherByCode,
    redeemVoucher: redeemVoucherFn,
    handleCreateVoucher,
    handleUpdateVoucher,
    handleDeleteVoucher,
    handleTableChange
  }
} 