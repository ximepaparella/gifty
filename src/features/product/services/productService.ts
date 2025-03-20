import { Product, ProductFormData, ProductsResponse } from '../types'
import axios from 'axios'
import { authService } from '@/features/auth/services/authService'
import { extractApiResponse } from '@/utils/apiUtils'

// More robust API URL configuration
let API_URL: string;
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error('CRITICAL: Missing NEXT_PUBLIC_API_URL in production environment');
    // In production, fail early rather than using localhost
    throw new Error('API configuration error: Missing NEXT_PUBLIC_API_URL environment variable');
  }
  API_URL = process.env.NEXT_PUBLIC_API_URL;
} else {
  // Only use fallback in development
  API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

// Helper function to get the base URL and auth headers
const getApiConfig = () => {
  const token = authService.getToken();
  return {
    baseURL: API_URL,
    headers: token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    }
  };
};

export const getProducts = async (page = 1, limit = 10, sort?: string): Promise<ProductsResponse> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(
      `/products?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
      config
    );
    
    // For list endpoints, we need to preserve the original structure
    console.log("API Products response:", response.data);
    console.log("API response structure:", {
      hasData: !!response.data,
      status: response.data?.status,
      isDataArray: Array.isArray(response.data?.data),
      hasPagination: !!response.data?.pagination,
      paginationKeys: response.data?.pagination ? Object.keys(response.data.pagination) : 'N/A'
    });
    
    // The API returns { status, data, pagination }
    if (response.data && response.data.status === 'success' && 
        Array.isArray(response.data.data) && response.data.pagination) {
      // Format it to match our ProductsResponse type
      return {
        data: response.data.data,
        pagination: response.data.pagination
      };
    }
    
    // If we don't have pagination, create a default pagination object
    if (response.data && Array.isArray(response.data.data)) {
      console.log("Creating default pagination for products response");
      return {
        data: response.data.data,
        pagination: {
          page: page,
          limit: limit,
          total: response.data.data.length,
          pages: 1
        }
      };
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(`/products/${id}`, config);
    
    // Extract product data using the utility function
    return extractApiResponse<Product>(response);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const getProductsByStoreId = async (storeId: string): Promise<Product[]> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(`/products/store/${storeId}`, config);
    
    // Extract products data using the utility function
    const products = extractApiResponse<Product[]>(response);
    return products;
  } catch (error: any) {
    console.error('Error fetching store products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch store products');
  }
};

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  try {
    const config = getApiConfig();
    const response = await axios.post('/products', productData, config);
    
    return extractApiResponse<Product>(response);
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const updateProduct = async (id: string, productData: ProductFormData): Promise<Product> => {
  try {
    const config = getApiConfig();
    const response = await axios.put(`/products/${id}`, productData, config);
    
    return extractApiResponse<Product>(response);
  } catch (error: any) {
    console.error('Error updating product:', error);
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    await axios.delete(`/products/${id}`, config);
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
}; 