export interface Product {
  _id?: string  // MongoDB format
  id?: string   // API response format
  name: string
  description: string
  storeId: string
  price: number
  images?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductFormData {
  name: string
  description: string
  storeId: string
  price: number
  images?: string[]
  isActive?: boolean
}

export interface ProductsResponse {
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ProductsState {
  products: Product[]
  selectedProduct: Product | null
  loading: boolean
  submitting: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
} 