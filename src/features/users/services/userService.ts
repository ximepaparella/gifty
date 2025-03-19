import { User, UserFormData, UsersResponse } from '../types'
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

export const getUsers = async (page = 1, limit = 10, sort?: string): Promise<UsersResponse> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(
      `/users?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
      config
    );
    
    // For list endpoints, we need to preserve the original structure
    // Don't extract just the data array, we need the full response with pagination
    console.log("API Users response:", response.data);
    
    // The API returns { status, data, pagination }
    if (response.data && response.data.status === 'success' && 
        Array.isArray(response.data.data) && response.data.pagination) {
      // Format it to match our UsersResponse type
      return {
        data: response.data.data,
        pagination: response.data.pagination
      };
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(`/users/${id}`, config);
    
    // Extract user data using the utility function
    return extractApiResponse<User>(response);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

export const createUser = async (userData: UserFormData): Promise<User> => {
  try {
    const config = getApiConfig();
    const response = await axios.post('/users', userData, config);
    
    return extractApiResponse<User>(response);
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

export const updateUser = async (id: string, userData: UserFormData): Promise<User> => {
  try {
    const config = getApiConfig();
    const response = await axios.put(`/users/${id}`, userData, config);
    
    return extractApiResponse<User>(response);
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    await axios.delete(`/users/${id}`, config);
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
}; 