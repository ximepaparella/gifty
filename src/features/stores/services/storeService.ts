import { Store, StoreFormData, StoresResponse } from '../types'
import axios from 'axios'
import { authService } from '@/features/auth/services/authService'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

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
    
    // API returns { data: Store, status: "success" } structure
    // Stores use _id format
    let storeData = response.data.data || response.data;
    
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
    
    // Extract store data from response
    const newStore = response.data.data || response.data;
    
    return newStore;
  } catch (error: any) {
    console.error('Error creating store:', error);
    throw new Error(error.response?.data?.message || 'Failed to create store');
  }
};

export const updateStore = async (id: string, storeData: StoreFormData): Promise<Store> => {
  try {
    const config = getApiConfig();
    const response = await axios.put(`/stores/${id}`, storeData, config);
    
    // Extract store data from response if needed
    const updatedStore = response.data.data || response.data;
    
    return updatedStore;
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