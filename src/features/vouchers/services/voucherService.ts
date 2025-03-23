import { Voucher, VoucherFormData, VouchersResponse } from '../types'
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

// Get all vouchers with pagination
export const getVouchers = async (page = 1, limit = 10, sort?: string): Promise<VouchersResponse> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(
      `/vouchers?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
      config
    );
    
    // For list endpoints, we need to preserve the original structure
    console.log("API Vouchers response:", response.data);
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
      // Format it to match our VouchersResponse type
      return {
        data: response.data.data,
        pagination: response.data.pagination
      };
    }
    
    // If we don't have pagination, create a default pagination object
    if (response.data && Array.isArray(response.data.data)) {
      console.log("Creating default pagination for vouchers response");
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
    console.error('Error fetching vouchers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vouchers');
  }
};

// Get voucher by ID
export const getVoucherById = async (id: string): Promise<Voucher> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(`/vouchers/${id}`, config);
    
    return extractApiResponse<Voucher>(response);
  } catch (error: any) {
    console.error('Error fetching voucher:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch voucher');
  }
};

// Get voucher by code
export const getVoucherByCode = async (code: string): Promise<Voucher> => {
  try {
    console.log(`Fetching voucher with code: ${code}`);
    
    // Log the complete API URL being called
    const config = getApiConfig();
    
    // Fixed API URL - don't include /api/v1 since it's already in the baseURL
    const apiUrl = `/vouchers/code/${code}/redeem`;
    console.log(`API URL being called: ${config.baseURL}${apiUrl}`);
    
    // Make the API call with proper error handling
    const response = await axios.get(apiUrl, config);
    
    // Log the response data structure to debug
    console.log('API response for voucher code:', {
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data,
      dataStructure: response.data ? Object.keys(response.data) : 'No data',
      data: response.data
    });
    
    return extractApiResponse<Voucher>(response);
  } catch (error: any) {
    console.error('Error fetching voucher by code:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    
    // Provide a more specific error message
    throw new Error(error.response?.data?.message || `Failed to fetch voucher with code ${code}`);
  }
};

// Get vouchers by store ID
export const getVouchersByStoreId = async (storeId: string): Promise<Voucher[]> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(`/vouchers/store/${storeId}`, config);
    
    return extractApiResponse<Voucher[]>(response);
  } catch (error: any) {
    console.error('Error fetching store vouchers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch store vouchers');
  }
};

// Get vouchers by customer ID
export const getVouchersByCustomerId = async (customerId: string): Promise<Voucher[]> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(`/vouchers/customer/${customerId}`, config);
    
    return extractApiResponse<Voucher[]>(response);
  } catch (error: any) {
    console.error('Error fetching customer vouchers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch customer vouchers');
  }
};

// Create voucher
export const createVoucher = async (voucherData: VoucherFormData): Promise<Voucher> => {
  try {
    const config = getApiConfig();
    const response = await axios.post('/vouchers', voucherData, config);
    
    return extractApiResponse<Voucher>(response);
  } catch (error: any) {
    console.error('Error creating voucher:', error);
    throw new Error(error.response?.data?.message || 'Failed to create voucher');
  }
};

// Update voucher
export const updateVoucher = async (id: string, voucherData: VoucherFormData): Promise<Voucher> => {
  try {
    const config = getApiConfig();
    const response = await axios.put(`/vouchers/${id}`, voucherData, config);
    
    return extractApiResponse<Voucher>(response);
  } catch (error: any) {
    console.error('Error updating voucher:', error);
    throw new Error(error.response?.data?.message || 'Failed to update voucher');
  }
};

// Delete voucher
export const deleteVoucher = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    await axios.delete(`/vouchers/${id}`, config);
  } catch (error: any) {
    console.error('Error deleting voucher:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete voucher');
  }
};

// Redeem voucher
export const redeemVoucher = async (code: string): Promise<boolean> => {
  try {
    const config = getApiConfig();
    
    // Fixed API URL - don't include /api/v1 prefix since it's already in baseURL
    const apiUrl = `/vouchers/code/${code}/redeem`;
    console.log(`Redeeming voucher with URL: ${config.baseURL}${apiUrl}`);
    
    const response = await axios.post(apiUrl, {}, config);
    
    console.log('Redeem voucher response:', {
      status: response.status,
      data: response.data
    });
    
    if (response.data && response.data.status === 'success') {
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error('Error redeeming voucher:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Redeem error status:', error.response.status);
      console.error('Redeem error data:', error.response.data);
    }
    
    throw new Error(error.response?.data?.message || `Failed to redeem voucher with code ${code}`);
  }
}; 