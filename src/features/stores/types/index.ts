export interface Store {
  _id?: string  // MongoDB format
  id?: string   // API response format
  name: string
  ownerId: string
  email: string
  phone: string
  address: string
  createdAt: string
  updatedAt: string
}

export interface StoreFormData {
  name: string
  email: string
  phone: string
  address: string
  ownerId?: string
}

export interface StoresResponse {
  data: Store[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface StoresState {
  stores: Store[]
  selectedStore: Store | null
  loading: boolean
  submitting: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
} 