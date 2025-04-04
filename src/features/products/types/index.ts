export interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  storeId: string;
  image: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  storeId: string;
  image?: File | null;
  isActive?: boolean;
}

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  submitting: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 