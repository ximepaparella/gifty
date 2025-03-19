import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { App } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../services/userService'
import { User, UserFormData, UsersState } from '../types'

// Query keys
const USERS_QUERY_KEY = 'users'
const USER_DETAIL_QUERY_KEY = 'user-detail'

export const useUsers = () => {
  const { notification } = App.useApp();
  const [paginationParams, setPaginationParams] = useState({
    current: 1,
    pageSize: 10,
    sort: ''
  })
  
  const [state, setState] = useState<Omit<UsersState, 'users' | 'pagination'>>({
    selectedUser: null,
    loading: false,
    submitting: false
  })
  
  const router = useRouter()
  const queryClient = useQueryClient()
  
  // Get users with pagination and sorting - uses react-query for caching
  const { 
    data: usersData,
    isLoading,
    isError,
    error: usersError
  } = useQuery({
    queryKey: [USERS_QUERY_KEY, paginationParams],
    queryFn: () => getUsers(
      paginationParams.current,
      paginationParams.pageSize,
      paginationParams.sort
    ),
    // Don't refetch on window focus to prevent unnecessary requests
    refetchOnWindowFocus: false,
    // Handle errors outside the query to avoid infinite loops
    retry: false,
    staleTime: 60000, // 1 minute
  })
  
  // Get a single user by id
  const fetchUserById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, selectedUser: null }))
    
    try {
      if (!id) {
        throw new Error('User ID is required')
      }
      
      const userData = await getUserById(id)
      
      // Store in query cache and component state
      queryClient.setQueryData([USER_DETAIL_QUERY_KEY, id], userData)
      setState(prev => ({ ...prev, selectedUser: userData }))
      return userData
    } catch (error: any) {
      notification.error({
        message: 'Error al obtener los detalles del usuario',
        description: error.message
      })
      router.push('/dashboard/users')
      return null
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [queryClient, router, notification])
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (values: UserFormData) => createUser(values),
    onSuccess: () => {
      notification.success({ message: 'Usuario creado exitosamente' })
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
      router.push('/dashboard/users')
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error al crear usuario',
        description: error.message
      })
    }
  })
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, values }: { id: string, values: UserFormData }) => {
      // If password is empty, remove it from the request
      if (!values.password) {
        const { password, ...userData } = values
        return updateUser(id, userData)
      }
      return updateUser(id, values)
    },
    onSuccess: () => {
      notification.success({ message: 'Usuario actualizado exitosamente' })
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
      router.push('/dashboard/users')
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error al actualizar usuario',
        description: error.message
      })
    }
  })
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      notification.success({ message: 'Usuario eliminado exitosamente' })
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error al eliminar usuario',
        description: error.message
      })
    }
  })
  
  // Create user handler
  const handleCreateUser = useCallback((values: UserFormData) => {
    // Transform role if needed (for backward compatibility with forms)
    const transformedValues = { 
      ...values,
      role: values.role === 'manager' ? 'store_manager' : values.role 
    }
    
    createUserMutation.mutate(transformedValues)
  }, [createUserMutation])
  
  // Update user handler
  const handleUpdateUser = useCallback((id: string, values: UserFormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!id) {
        notification.error({
          message: 'Error al actualizar usuario',
          description: 'ID de usuario no proporcionado'
        })
        reject(new Error('ID de usuario no proporcionado'));
        return;
      }
      
      // Transform role if needed (for backward compatibility)
      const transformedValues = { 
        ...values,
        role: values.role === 'manager' ? 'store_manager' : values.role 
      }
      
      updateUserMutation.mutate(
        { id, values: transformedValues },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        }
      );
    });
  }, [updateUserMutation, notification])
  
  // Delete user handler
  const handleDeleteUser = useCallback((id: string) => {
    deleteUserMutation.mutate(id)
  }, [deleteUserMutation])
  
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
  if (isError && usersError) {
    notification.error({
      message: 'Failed to fetch users',
      description: (usersError as Error).message
    })
  }
  
  return {
    // Data
    users: usersData?.data || [],
    selectedUser: state.selectedUser,
    // Loading states
    loading: isLoading || state.loading,
    submitting: createUserMutation.isPending || updateUserMutation.isPending || state.submitting,
    // Error state
    error: usersError,
    // Pagination info
    pagination: {
      current: paginationParams.current,
      pageSize: paginationParams.pageSize,
      total: usersData?.pagination?.total || 0
    },
    // Actions
    fetchUserById,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleTableChange
  }
} 