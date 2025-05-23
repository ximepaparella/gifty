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
    console.log('=== Create Product Service Start ===');
    console.log('Product data received:', {
      ...productData,
      image: productData.image ? {
        name: productData.image.name,
        type: productData.image.type,
        size: productData.image.size
      } : null
    });

    // Always use FormData for consistency
    const formData = new FormData();
    
    // Add the image file if it exists
    if (productData.image instanceof File) {
      console.log('Adding image file to FormData');
      formData.append('file', productData.image);
    }
    
    // Add all other product data as JSON
    const { image, ...productDataWithoutImage } = productData;
    formData.append('data', JSON.stringify(productDataWithoutImage));
    
    console.log('FormData contents:', {
      hasFile: formData.has('file'),
      hasData: formData.has('data'),
      data: productDataWithoutImage
    });
    
    // Always use multipart/form-data for consistency
    const config = getApiConfig(true);
    console.log('Sending request with config:', {
      headers: config.headers,
      baseURL: config.baseURL
    });
    
    const response = await axios.post('/products', formData, config);
    console.log('Create product response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('=== Create Product Error ===');
    console.error('Error details:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
  try {
    console.log('=== Update Product Service Start ===');
    console.log('Product data received:', {
      ...productData,
      image: productData.image ? {
        name: productData.image.name,
        type: productData.image.type,
        size: productData.image.size
      } : null
    });

    // Always use FormData for consistency
    const formData = new FormData();
    
    // Add the image file if it exists
    if (productData.image instanceof File) {
      console.log('Adding image file to FormData');
      formData.append('file', productData.image);
    }
    
    // Add all other product data as JSON
    const { image, ...productDataWithoutImage } = productData;
    formData.append('data', JSON.stringify(productDataWithoutImage));
    
    console.log('FormData contents:', {
      hasFile: formData.has('file'),
      hasData: formData.has('data'),
      data: productDataWithoutImage
    });
    
    // Always use multipart/form-data for consistency
    const config = getApiConfig(true);
    console.log('Sending request with config:', {
      headers: config.headers,
      baseURL: config.baseURL
    });
    
    const response = await axios.put(`/products/${id}`, formData, config);
    console.log('Update product response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('=== Update Product Error ===');
    console.error('Error details:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
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

export const uploadProductImage = async (productId: string, imageFile: File): Promise<void> => {
  try {
    console.log('Uploading image for product:', productId);
    console.log('Image details:', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    const formData = new FormData();
    formData.append('image', imageFile);

    const config = getApiConfig(true);
    await axios.post(`/products/${productId}/image`, formData, config);
  } catch (error: any) {
    console.error('Error uploading product image:', error);
    console.error('Error response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to upload product image');
  }
}; 