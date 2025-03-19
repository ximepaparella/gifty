export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'store_manager' | 'customer'
  createdAt: string
  updatedAt: string
}

export interface UserFormData {
  name: string
  email: string
  password?: string
  role: 'admin' | 'store_manager' | 'customer' | 'manager'
}

export interface UsersResponse {
  data: User[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface UsersState {
  users: User[]
  selectedUser: User | null
  loading: boolean
  submitting: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
} 