import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { App } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Customer, CustomerFormData, CustomersResponse } from '../types'
import { 
  getCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer 
} from '../services/customerService'

// Query keys
const CUSTOMERS_QUERY_KEY = 'customers'
const CUSTOMER_DETAIL_QUERY_KEY = 'customer-detail'

interface CustomersState {
  selectedCustomer: Customer | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

export const useCustomers = () => {
  const router = useRouter()
  const { notification } = App.useApp()
  const queryClient = useQueryClient()
  const [state, setState] = useState<CustomersState>({
    selectedCustomer: null,
    loading: false,
    submitting: false,
    error: null
  })

  // Pagination state
  const [paginationParams, setPaginationParams] = useState({
    current: 1,
    pageSize: 10,
    sort: ''
  })

  // Fetch customers query
  const { data: customersData, isLoading } = useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, paginationParams],
    queryFn: () => getCustomers(paginationParams.current, paginationParams.pageSize, paginationParams.sort),
    refetchOnWindowFocus: false,
    staleTime: 60000 // 1 minute
  })

  // Fetch customer by ID
  const fetchCustomerById = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      const customer = await getCustomerById(id)
      setState(prev => ({ ...prev, selectedCustomer: customer, loading: false }))
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
      notification.error({
        message: 'Error fetching customer',
        description: error.message
      })
    }
  }, [notification])

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: (customerData: CustomerFormData) => createCustomer(customerData),
    onMutate: () => {
      setState(prev => ({ ...prev, submitting: true }))
    },
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Customer created successfully'
      })
      setState(prev => ({ ...prev, submitting: false }))
      router.push('/dashboard/customers')
      return queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error creating customer',
        description: error.message
      })
      setState(prev => ({ ...prev, submitting: false }))
    }
  })

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, customerData }: { id: string; customerData: CustomerFormData }) => 
      updateCustomer(id, customerData),
    onMutate: () => {
      setState(prev => ({ ...prev, submitting: true }))
    },
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Customer updated successfully'
      })
      setState(prev => ({ ...prev, submitting: false }))
      router.push('/dashboard/customers')
      return queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error updating customer',
        description: error.message
      })
      setState(prev => ({ ...prev, submitting: false }))
    }
  })

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Customer deleted successfully'
      })
      return queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error deleting customer',
        description: error.message
      })
    }
  })

  // Handle table pagination change
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const sort = sorter.order 
      ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}`
      : ''
    
    setPaginationParams({
      current: pagination.current,
      pageSize: pagination.pageSize,
      sort
    })
  }

  // Handle customer creation
  const handleCreateCustomer = async (customerData: CustomerFormData) => {
    createCustomerMutation.mutate(customerData)
  }

  // Handle customer update
  const handleUpdateCustomer = async (id: string, customerData: CustomerFormData) => {
    updateCustomerMutation.mutate({ id, customerData })
  }

  // Handle customer deletion
  const handleDeleteCustomer = async (id: string) => {
    deleteCustomerMutation.mutate(id)
  }

  return {
    customers: customersData?.data || [],
    selectedCustomer: state.selectedCustomer,
    loading: isLoading || state.loading,
    submitting: state.submitting,
    error: state.error,
    pagination: {
      current: paginationParams.current,
      pageSize: paginationParams.pageSize,
      total: customersData?.pagination?.total || 0
    },
    fetchCustomerById,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
    handleTableChange
  }
} 