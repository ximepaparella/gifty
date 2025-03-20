import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { App } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Voucher, VoucherFormData, VouchersState } from '../types'
import { 
  getVouchers, 
  getVoucherById, 
  createVoucher, 
  updateVoucher, 
  deleteVoucher,
  redeemVoucher
} from '../services/voucherService'

// Query keys
const VOUCHERS_QUERY_KEY = 'vouchers'
const VOUCHER_DETAIL_QUERY_KEY = 'voucher-detail'

export const useVouchers = () => {
  const { notification } = App.useApp();
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [paginationParams, setPaginationParams] = useState({
    current: 1,
    pageSize: 10,
    sort: ''
  })
  
  const [state, setState] = useState<Omit<VouchersState, 'vouchers' | 'pagination'>>({
    selectedVoucher: null,
    loading: false,
    submitting: false
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
      // Prevent unnecessary re-fetching if we already have the voucher
      if (state.selectedVoucher && 
          (state.selectedVoucher.id === id || state.selectedVoucher._id === id)) {
        console.log("Voucher already loaded, skipping fetch");
        return state.selectedVoucher;
      }
      
      setState(prev => ({ ...prev, loading: true }));
      console.log("Fetching voucher with ID:", id);
      const voucher = await getVoucherById(id);
      console.log("Fetched voucher:", voucher);
      
      // Make sure voucher has all required fields
      if (!voucher) {
        throw new Error("No voucher data returned from API");
      }
      
      setState(prev => ({ ...prev, selectedVoucher: voucher, loading: false }));
      return voucher;
    } catch (error: any) {
      console.error("Error fetching voucher:", error);
      notification.error({
        message: 'Error fetching voucher',
        description: error.message
      });
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [notification, state.selectedVoucher]);

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

  // Redeem voucher mutation
  const redeemVoucherMutation = useMutation({
    mutationFn: (code: string) => redeemVoucher(code),
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Voucher redeemed successfully'
      })
      return queryClient.invalidateQueries({ queryKey: [VOUCHERS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error redeeming voucher',
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

  // Handle voucher redemption
  const handleRedeemVoucher = async (code: string) => {
    redeemVoucherMutation.mutate(code)
  }

  return {
    vouchers: vouchersData?.data || [],
    selectedVoucher: state.selectedVoucher,
    loading: isLoading || state.loading,
    submitting: state.submitting,
    pagination: {
      current: paginationParams.current,
      pageSize: paginationParams.pageSize,
      total: vouchersData?.pagination?.total || 0
    },
    fetchVoucherById,
    handleCreateVoucher,
    handleUpdateVoucher,
    handleDeleteVoucher,
    handleRedeemVoucher,
    handleTableChange
  }
} 