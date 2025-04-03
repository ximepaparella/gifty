import { Product, ProductFormData, ProductsResponse } from '../types';
import axios from 'axios';
import { authService } from '@/features/auth/services/authService';
import { extractApiResponse } from '@/utils/apiUtils';

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
const getApiConfig = (isMultipart = false) => {
  const token = authService.getToken();
  return {
    baseURL: API_URL,
    headers: token ? {
      'Authorization': `Bearer ${token}`,
      ...(isMultipart ? {
        'Content-Type': 'multipart/form-data'
      } : {
        'Content-Type': 'application/json'
      })
    } : {
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json'
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
    
    // The API returns { status, data, pagination }
    if (response.data && response.data.status === 'success' && 
        Array.isArray(response.data.data) && response.data.pagination) {
      // Format it to match our ProductsResponse type
      return {
        data: response.data.data,
        pagination: response.data.pagination
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
    return extractApiResponse(response);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  try {
    // Validate store ID first
    if (!productData.storeId) {
      throw new Error('Store ID is required');
    }

    // If there's an image file, use FormData
    if (productData.image instanceof File) {
      const formData = new FormData();
      
      // Add image file
      formData.append('image', productData.image);
      
      // Create the data object without the image
      const { image, ...productDataWithoutImage } = productData;
      
      // Add the data as a JSON string
      formData.append('data', JSON.stringify({
        ...productDataWithoutImage,
        isActive: true
      }));
      
      const config = getApiConfig(true);
      const response = await axios.post('/products', formData, config);
      return extractApiResponse(response);
    } else {
      // If no image file, send as regular JSON with isActive
      const { image, ...productDataWithoutImage } = productData;
      const config = getApiConfig();
      const response = await axios.post('/products', {
        ...productDataWithoutImage,
        isActive: true
      }, config);
      return extractApiResponse(response);
    }
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
  try {
    // If there's an image file, use FormData
    if (productData.image instanceof File) {
      const formData = new FormData();
      formData.append('image', productData.image);
      
      // Append other product data as JSON string
      const productDataWithoutImage = { ...productData };
      delete productDataWithoutImage.image;
      formData.append('data', JSON.stringify(productDataWithoutImage));
      
      const config = getApiConfig(true);
      const response = await axios.put(`/products/${id}`, formData, config);
      return extractApiResponse(response);
    } else {
      // If no image file, send as regular JSON
      const config = getApiConfig();
      const response = await axios.put(`/products/${id}`, productData, config);
      return extractApiResponse(response);
    }
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