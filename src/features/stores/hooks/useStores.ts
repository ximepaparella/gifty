import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { App } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getStores, 
  getStoreById, 
  createStore, 
  updateStore, 
  deleteStore 
} from '../services/storeService'
import { Store, StoreFormData, StoresState } from '../types'

// Query keys
const STORES_QUERY_KEY = 'stores'
const STORE_DETAIL_QUERY_KEY = 'store-detail'

export const useStores = () => {
  const { notification } = App.useApp();
  const [paginationParams, setPaginationParams] = useState({
    current: 1,
    pageSize: 10,
    sort: ''
  })
  
  const [state, setState] = useState<Omit<StoresState, 'stores' | 'pagination'>>({
    selectedStore: null,
    loading: false,
    submitting: false
  })
  
  const router = useRouter()
  const queryClient = useQueryClient()
  
  // Get stores with pagination and sorting
  const { 
    data: storesData,
    isLoading,
    isError,
    error: storesError
  } = useQuery({
    queryKey: [STORES_QUERY_KEY, paginationParams],
    queryFn: () => getStores(
      paginationParams.current,
      paginationParams.pageSize,
      paginationParams.sort
    ),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60000, // 1 minute
  })
  
  // Get a single store by id
  const fetchStoreById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, selectedStore: null }))
    
    try {
      if (!id) {
        throw new Error('Store ID is required')
      }
      
      console.log(`Fetching store with ID: ${id}`)
      
      const storeData = await getStoreById(id)
      console.log("Store data received:", storeData)
      
      // Store in query cache and component state
      queryClient.setQueryData([STORE_DETAIL_QUERY_KEY, id], storeData)
      setState(prev => ({ ...prev, selectedStore: storeData }))
      return storeData
    } catch (error: any) {
      notification.error({
        message: 'Error al obtener los detalles de la tienda',
        description: error.message
      })
      router.push('/dashboard/stores')
      return null
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [queryClient, router, notification])
  
  // Create store mutation
  const createStoreMutation = useMutation({
    mutationFn: (values: StoreFormData) => createStore(values),
    onSuccess: () => {
      notification.success({ message: 'Tienda creada exitosamente' })
      queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] })
      router.push('/dashboard/stores')
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error al crear tienda',
        description: error.message
      })
    }
  })
  
  // Update store mutation
  const updateStoreMutation = useMutation({
    mutationFn: ({ id, values }: { id: string, values: StoreFormData }) => {
      return updateStore(id, values)
    },
    onSuccess: () => {
      notification.success({ message: 'Tienda actualizada exitosamente' })
      queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] })
      router.push('/dashboard/stores')
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error al actualizar tienda',
        description: error.message
      })
    }
  })
  
  // Delete store mutation
  const deleteStoreMutation = useMutation({
    mutationFn: (id: string) => deleteStore(id),
    onSuccess: () => {
      notification.success({ message: 'Tienda eliminada exitosamente' })
      queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error al eliminar tienda',
        description: error.message
      })
    }
  })
  
  // Create store handler
  const handleCreateStore = useCallback((values: StoreFormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      createStoreMutation.mutate(values, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error)
      })
    })
  }, [createStoreMutation])
  
  // Update store handler
  const handleUpdateStore = useCallback((id: string, values: StoreFormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!id) {
        notification.error({
          message: 'Error al actualizar tienda',
          description: 'ID de tienda no proporcionado'
        })
        reject(new Error('ID de tienda no proporcionado'));
        return;
      }
      
      updateStoreMutation.mutate(
        { id, values },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        }
      );
    });
  }, [updateStoreMutation, notification])
  
  // Delete store handler
  const handleDeleteStore = useCallback((id: string) => {
    deleteStoreMutation.mutate(id)
  }, [deleteStoreMutation])
  
  // Handle table changes (pagination, sorting)
  const handleTableChange = useCallback((pagination: any, _filters: any, sorter: any) => {
    const { current, pageSize } = pagination
    
    // Build sort parameter
    let sort = ''
    if (sorter.field && sorter.order) {
      const order = sorter.order === 'ascend' ? 'asc' : 'desc'
      sort = `${sorter.field}:${order}`
    }
    
    // Update pagination params (will trigger a re-fetch via react-query)
    setPaginationParams({
      current,
      pageSize,
      sort
    })
  }, [])
  
  // Handle error display from the query
  if (isError && storesError) {
    notification.error({
      message: 'Error al obtener tiendas',
      description: (storesError as Error).message
    })
  }
  
  return {
    // Data
    stores: storesData?.data || [],
    selectedStore: state.selectedStore,
    // Loading states
    loading: isLoading || state.loading,
    submitting: createStoreMutation.isPending || updateStoreMutation.isPending || state.submitting,
    // Error state
    error: storesError,
    // Pagination info
    pagination: {
      current: paginationParams.current,
      pageSize: paginationParams.pageSize,
      total: storesData?.pagination?.total || 0
    },
    // Actions
    fetchStoreById,
    handleCreateStore,
    handleUpdateStore,
    handleDeleteStore,
    handleTableChange
  }
} 