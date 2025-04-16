import { Customer, CustomerFormData, CustomersResponse } from '../types'
import axios from 'axios'
import { authService } from '@/features/auth/services/authService'
import { extractApiResponse } from '@/utils/apiUtils'

// More robust API URL configuration
let API_URL: string;
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error('CRITICAL: Missing NEXT_PUBLIC_API_URL in production environment');
    throw new Error('API configuration error: Missing NEXT_PUBLIC_API_URL environment variable');
  }
  API_URL = process.env.NEXT_PUBLIC_API_URL;
} else {
  API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

// Helper function to get the base URL and auth headers
const getApiConfig = () => {
  const token = authService.getToken();
  return {
    baseURL: API_URL,
    headers: {
      'X-API-Key': process.env.NEXT_PUBLIC_API_KEY,
      ...(token ? {
        'Authorization': `Bearer ${token}`,
      } : {}),
      'Content-Type': 'application/json'
    }
  };
};

export const getCustomers = async (page = 1, limit = 10, sort?: string): Promise<CustomersResponse> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(
      `/customers?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
      config
    );
    
    console.log("API Customers response:", response.data);
    
    if (response.data && response.data.status === 'success' && 
        Array.isArray(response.data.data) && response.data.pagination) {
      return {
        data: response.data.data,
        pagination: response.data.pagination
      };
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch customers');
  }
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(`/customers/${id}`, config);
    return extractApiResponse<Customer>(response);
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch customer');
  }
};

export const createCustomer = async (customerData: CustomerFormData): Promise<Customer> => {
  try {
    const config = getApiConfig();
    const response = await axios.post('/customers', customerData, config);
    return extractApiResponse<Customer>(response);
  } catch (error: any) {
    console.error('Error creating customer:', error);
    throw new Error(error.response?.data?.message || 'Failed to create customer');
  }
};

export const updateCustomer = async (id: string, customerData: CustomerFormData): Promise<Customer> => {
  try {
    const config = getApiConfig();
    const response = await axios.put(`/customers/${id}`, customerData, config);
    return extractApiResponse<Customer>(response);
  } catch (error: any) {
    console.error('Error updating customer:', error);
    throw new Error(error.response?.data?.message || 'Failed to update customer');
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    await axios.delete(`/customers/${id}`, config);
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete customer');
  }
};

export const customerService = {
  async getCustomers(page: number = 1, limit: number = 10): Promise<{ data: Customer[]; total: number }> {
    try {
      const response = await axios.get(`${API_URL}/customers`, {
        params: { page, limit }
      })
      return {
        data: response.data.data,
        total: response.data.total
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      throw error
    }
  },

  async getCustomerById(id: string): Promise<Customer> {
    try {
      const response = await axios.get(`${API_URL}/customers/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching customer:', error)
      throw error
    }
  },

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    try {
      const response = await axios.post(`${API_URL}/customers`, customer)
      return response.data.data
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  },

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    try {
      const response = await axios.put(`${API_URL}/customers/${id}`, customer)
      return response.data.data
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  },

  async deleteCustomer(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/customers/${id}`)
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    }
  }
} 