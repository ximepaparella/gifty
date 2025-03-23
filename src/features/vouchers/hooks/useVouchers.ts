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

export const useVouchers = () => {
  const { notification } = App.useApp();
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [paginationParams, setPaginationParams] = useState({
    current: 1,
    pageSize: 10,
    sort: ''
  })
  
  const [state, setState] = useState<any>({
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
      setState(prev => ({ ...prev, loading: true, error: null }));
      const voucher = await getVoucherById(id);
      setState(prev => ({ ...prev, selectedVoucher: voucher, loading: false }));
      return voucher;
    } catch (error: any) {
      notification.error({
        message: 'Error fetching voucher',
        description: error.message
      });
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  }, [notification]);

  // Fetch voucher by code (for redemption)
  const getVoucherByCodeFn = useCallback(async (code: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const voucher = await getVoucherByCode(code);
      setState(prev => ({ ...prev, currentVoucher: voucher, loading: false }));
      return voucher;
    } catch (error: any) {
      notification.error({
        message: 'Error fetching voucher by code',
        description: error.message
      });
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  }, [notification]);

  // Redeem voucher
  const redeemVoucherFn = useCallback(async (code: string) => {
    try {
      setState(prev => ({ ...prev, submitting: true, error: null }));
      const result = await redeemVoucherAPI(code);
      
      // Update the current voucher with the redeemed status
      if (result && state.currentVoucher) {
        setState(prev => ({ 
          ...prev, 
          currentVoucher: { 
            ...prev.currentVoucher, 
            status: 'redeemed',
            isRedeemed: true,
            redeemedAt: new Date().toISOString()
          }, 
          submitting: false 
        }));
      }
      
      notification.success({
        message: 'Success',
        description: 'Voucher redeemed successfully'
      });
      
      return result;
    } catch (error: any) {
      notification.error({
        message: 'Error redeeming voucher',
        description: error.message
      });
      setState(prev => ({ ...prev, submitting: false, error: error.message }));
      throw error;
    }
  }, [notification, state.currentVoucher]);

  // Create voucher mutation
  const createVoucherMutation = useMutation({
    mutationFn: (voucherData: VoucherFormData) => createVoucher(voucherData),
    onMutate: () => {
      setState(prev => ({ ...prev, submitting: true }))
    },
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Voucher created successfully'
      })
      setState(prev => ({ ...prev, submitting: false }))
      router.push('/dashboard/vouchers')
      return queryClient.invalidateQueries({ queryKey: [VOUCHERS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error creating voucher',
        description: error.message
      })
      setState(prev => ({ ...prev, submitting: false }))
    }
  })

  // Update voucher mutation
  const updateVoucherMutation = useMutation({
    mutationFn: ({ id, voucherData }: { id: string; voucherData: VoucherFormData }) => 
      updateVoucher(id, voucherData),
    onMutate: () => {
      setState(prev => ({ ...prev, submitting: true }))
    },
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Voucher updated successfully'
      })
      setState(prev => ({ ...prev, submitting: false }))
      router.push('/dashboard/vouchers')
      return queryClient.invalidateQueries({ queryKey: [VOUCHERS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error updating voucher',
        description: error.message
      })
      setState(prev => ({ ...prev, submitting: false }))
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
    getVoucherByCode: getVoucherByCodeFn,
    redeemVoucher: redeemVoucherFn,
    handleCreateVoucher,
    handleUpdateVoucher,
    handleDeleteVoucher,
    handleTableChange
  }
} 