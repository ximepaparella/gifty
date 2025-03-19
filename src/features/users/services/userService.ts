import { User, UserFormData, UsersResponse } from '../types'
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

export const getUsers = async (page = 1, limit = 10, sort?: string): Promise<UsersResponse> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(
      `/users?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
      config
    );
    
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
    
    // API returns { data: User, status: "success" } structure
    const userData = response.data.data || response.data;
    
    return userData;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

export const createUser = async (userData: UserFormData): Promise<User> => {
  try {
    const config = getApiConfig();
    const response = await axios.post('/users', userData, config);
    
    return response.data;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

export const updateUser = async (id: string, userData: UserFormData): Promise<User> => {
  try {
    const config = getApiConfig();
    const response = await axios.put(`/users/${id}`, userData, config);
    
    return response.data;
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