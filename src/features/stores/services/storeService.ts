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
    const config = getApiConfig();
    const response = await axios.post('/stores', storeData, config);
    
    // Extract store data using the utility function
    return extractApiResponse<Store>(response);
  } catch (error: any) {
    console.error('Error creating store:', error);
    throw new Error(error.response?.data?.message || 'Failed to create store');
  }
};

export const updateStore = async (id: string, storeData: StoreFormData): Promise<Store> => {
  try {
    const config = getApiConfig();
    const response = await axios.put(`/stores/${id}`, storeData, config);
    
    // Extract store data using the utility function
    return extractApiResponse<Store>(response);
  } catch (error: any) {
    console.error('Error updating store:', error);
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