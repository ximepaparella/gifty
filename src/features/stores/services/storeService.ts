import { Store, StoreFormData, StoresResponse } from '../types'
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

export const getStores = async (page = 1, limit = 10, sort?: string): Promise<StoresResponse> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(
      `/stores?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
      config
    );
    
    // For list endpoints, we need to preserve the original structure
    // Don't extract just the data array, we need the full response with pagination
    console.log("API Stores response:", response.data);
    
    // The API returns { status, data, pagination }
    if (response.data && response.data.status === 'success' && 
        Array.isArray(response.data.data) && response.data.pagination) {
      // Format it to match our StoresResponse type
      return {
        data: response.data.data,
        pagination: response.data.pagination
      };
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching stores:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch stores');
  }
};

export const getStoreById = async (id: string): Promise<Store> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(`/stores/${id}`, config);
    
    // Extract store data using the utility function
    const storeData = extractApiResponse<Store>(response);
    
    // Log for debugging
    console.log("Raw store data from API:", storeData);
    
    return storeData;
  } catch (error: any) {
    console.error('Error fetching store:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch store');
  }
};

export const createStore = async (storeData: StoreFormData): Promise<Store> => {
  try {
    // If there's a logo file, use FormData
    if (storeData.logo instanceof File) {
      const formData = new FormData();
      formData.append('logo', storeData.logo);
      
      // Append other store data as JSON string
      const storeDataWithoutLogo = { ...storeData };
      delete storeDataWithoutLogo.logo;
      formData.append('data', JSON.stringify(storeDataWithoutLogo));
      
      const config = getApiConfig(true);
      const response = await axios.post('/stores', formData, config);
      return extractApiResponse<Store>(response);
    } else {
      // If no logo file, send as regular JSON
      const config = getApiConfig();
      const response = await axios.post('/stores', storeData, config);
      return extractApiResponse<Store>(response);
    }
  } catch (error: any) {
    console.error('Error creating store:', error);
    throw new Error(error.response?.data?.message || 'Failed to create store');
  }
};

export const updateStore = async (id: string, storeData: Partial<StoreFormData>): Promise<Store> => {
  try {
    console.log('========== UPDATE STORE SERVICE START ==========');
    console.log('Updating store with ID:', id);
    console.log('Store data received:', storeData);
    console.log('Logo type:', storeData.logo ? (storeData.logo instanceof File ? 'File object' : typeof storeData.logo) : 'undefined/null');
    
    // If there's a logo file, use FormData
    if (storeData.logo instanceof File) {
      console.log('Logo is a File object, using FormData');
      console.log('Logo file details:', {
        name: storeData.logo.name,
        type: storeData.logo.type,
        size: storeData.logo.size
      });
      
      const formData = new FormData();
      formData.append('logo', storeData.logo);
      
      // Append other store data as JSON string
      const storeDataWithoutLogo = { ...storeData };
      delete storeDataWithoutLogo.logo;
      formData.append('data', JSON.stringify(storeDataWithoutLogo));
      
      console.log('FormData prepared with logo file and JSON data');
      console.log('JSON data part:', JSON.stringify(storeDataWithoutLogo));
      
      const config = getApiConfig(true);
      console.log('Making PUT request with multipart/form-data');
      const response = await axios.put(`/stores/${id}`, formData, config);
      console.log('Update response:', response.data);
      return extractApiResponse<Store>(response);
    } else {
      // If no logo file, send as regular JSON
      console.log('No logo File object, using regular JSON');
      console.log('Complete data being sent:', storeData);
      
      const config = getApiConfig();
      console.log('Making PUT request with application/json');
      const response = await axios.put(`/stores/${id}`, storeData, config);
      console.log('Update response:', response.data);
      return extractApiResponse<Store>(response);
    }
  } catch (error: any) {
    console.error('Error updating store:', error);
    console.error('Error details:', error.response?.data || error.message);
    console.log('========== UPDATE STORE SERVICE END (ERROR) ==========');
    throw new Error(error.response?.data?.message || 'Failed to update store');
  }
};

export const deleteStore = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    await axios.delete(`/stores/${id}`, config);
  } catch (error: any) {
    console.error('Error deleting store:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete store');
  }
}; 