import axios from 'axios';
import { Order, OrderFormData, PaginatedOrdersResponse } from '../types';
import { extractApiResponse } from '@/utils/apiUtils';
import { authService } from '@/features/auth/services/authService';

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

/**
 * Get all orders with pagination
 */
export const getOrders = async (
  page: number = 1,
  limit: number = 10,
  sort?: string
): Promise<PaginatedOrdersResponse> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(
      `/orders?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
      config
    );
    
    console.log("API Orders response:", response.data);
    
    // Handle various response formats
    if (response.data) {
      // Case 1: Format is { status, data, pagination }
      if (response.data.status === 'success' && 
          Array.isArray(response.data.data) && 
          response.data.pagination) {
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      }
      
      // Case 2: Format is { data, pagination } directly
      if (Array.isArray(response.data.data) && response.data.pagination) {
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      }
      
      // Case 3: Response is the array directly
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          pagination: {
            page: page,
            limit: limit,
            total: response.data.length,
            pages: Math.ceil(response.data.length / limit)
          }
        };
      }
      
      // Case 4: Format is unexpected but we can try to extract data
      console.warn('Unexpected API response format, attempting to extract data:', response.data);
      return {
        data: Array.isArray(response.data.data) ? response.data.data : 
              Array.isArray(response.data) ? response.data : [],
        pagination: response.data.pagination || {
          page: page,
          limit: limit,
          total: 0,
          pages: 0
        }
      };
    }
    
    throw new Error('Invalid API response format: No data received');
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(`/orders/${id}`, config);
    
    console.log(`API Order ${id} response:`, response.data);
    
    // Different APIs might have different formats
    if (response.data) {
      // Case 1: Format is using extractApiResponse
      try {
        return extractApiResponse(response);
      } catch (extractError) {
        console.warn('Could not use extractApiResponse, falling back to direct data access');
        
        // Case 2: Data is directly in response.data
        if (response.data.id || response.data._id) {
          return response.data;
        }
        
        // Case 3: Data is in response.data.data
        if (response.data.data && (response.data.data.id || response.data.data._id)) {
          return response.data.data;
        }
      }
    }
    
    throw new Error(`Invalid API response format for order ${id}`);
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get order by voucher code
 */
export const getOrderByVoucherCode = async (code: string): Promise<Order> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(`/orders/voucher/${code}`, config);
    
    console.log(`API Order by voucher code ${code} response:`, response.data);
    
    // Different APIs might have different formats
    if (response.data) {
      // Case 1: Format is using extractApiResponse
      try {
        return extractApiResponse(response);
      } catch (extractError) {
        console.warn('Could not use extractApiResponse, falling back to direct data access');
        
        // Case 2: Data is directly in response.data
        if (response.data.id || response.data._id) {
          return response.data;
        }
        
        // Case 3: Data is in response.data.data
        if (response.data.data && (response.data.data.id || response.data.data._id)) {
          return response.data.data;
        }
      }
    }
    
    throw new Error(`Invalid API response format for voucher code ${code}`);
  } catch (error) {
    console.error(`Error fetching order with voucher code ${code}:`, error);
    throw error;
  }
};

/**
 * Get orders by customer ID
 */
export const getOrdersByCustomerId = async (
  customerId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedOrdersResponse> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(
      `/orders/customer/${customerId}?page=${page}&limit=${limit}`,
      config
    );
    
    console.log("API Customer Orders response:", response.data);
    
    // Handle various response formats
    if (response.data) {
      // Case 1: Format is { status, data, pagination }
      if (response.data.status === 'success' && 
          Array.isArray(response.data.data) && 
          response.data.pagination) {
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      }
      
      // Case 2: Format is { data, pagination } directly
      if (Array.isArray(response.data.data) && response.data.pagination) {
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      }
      
      // Case 3: Response is the array directly
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          pagination: {
            page: page,
            limit: limit,
            total: response.data.length,
            pages: Math.ceil(response.data.length / limit)
          }
        };
      }
      
      // Case 4: Format is unexpected but we can try to extract data
      console.warn('Unexpected API response format, attempting to extract data:', response.data);
      return {
        data: Array.isArray(response.data.data) ? response.data.data : 
              Array.isArray(response.data) ? response.data : [],
        pagination: response.data.pagination || {
          page: page,
          limit: limit,
          total: 0,
          pages: 0
        }
      };
    }
    
    throw new Error('Invalid API response format: No data received');
  } catch (error) {
    console.error(`Error fetching orders for customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Get orders by store ID
 */
export const getOrdersByStoreId = async (
  storeId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedOrdersResponse> => {
  try {
    const config = getApiConfig();
    const response = await axios.get(
      `/orders/store/${storeId}?page=${page}&limit=${limit}`,
      config
    );
    
    console.log("API Store Orders response:", response.data);
    
    // Handle various response formats
    if (response.data) {
      // Case 1: Format is { status, data, pagination }
      if (response.data.status === 'success' && 
          Array.isArray(response.data.data) && 
          response.data.pagination) {
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      }
      
      // Case 2: Format is { data, pagination } directly
      if (Array.isArray(response.data.data) && response.data.pagination) {
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      }
      
      // Case 3: Response is the array directly
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          pagination: {
            page: page,
            limit: limit,
            total: response.data.length,
            pages: Math.ceil(response.data.length / limit)
          }
        };
      }
      
      // Case 4: Format is unexpected but we can try to extract data
      console.warn('Unexpected API response format, attempting to extract data:', response.data);
      return {
        data: Array.isArray(response.data.data) ? response.data.data : 
              Array.isArray(response.data) ? response.data : [],
        pagination: response.data.pagination || {
          page: page,
          limit: limit,
          total: 0,
          pages: 0
        }
      };
    }
    
    throw new Error('Invalid API response format: No data received');
  } catch (error) {
    console.error(`Error fetching orders for store ${storeId}:`, error);
    throw error;
  }
};

/**
 * Create a new order
 */
export const createOrder = async (orderData: OrderFormData): Promise<Order> => {
  try {
    const config = getApiConfig();
    const response = await axios.post('/orders', orderData, config);
    return extractApiResponse(response);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Update an existing order
 */
export const updateOrder = async (id: string, orderData: OrderFormData): Promise<Order> => {
  try {
    console.log(`Updating order with ID: ${id}`);
    console.log('Order data being sent:', JSON.stringify(orderData, null, 2));
    
    const apiUrl = `/orders/${id}`;
    console.log(`API URL: ${apiUrl}`);
    
    const response = await axios.put<Order>(apiUrl, orderData, getApiConfig());
    console.log('Update order response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    
    // Enhanced error handling for better debugging
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        if (error.response.status === 404) {
          throw new Error(`Order with ID ${id} not found. Please check if the order exists.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        throw new Error('No response received from server. Please check your network connection.');
      }
    }
    
    throw error;
  }
};

/**
 * Delete an order
 */
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    await axios.delete(`/orders/${id}`, config);
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Redeem a voucher by code
 */
export const redeemVoucher = async (code: string): Promise<Order> => {
  try {
    const config = getApiConfig();
    const response = await axios.put(`/orders/voucher/${code}/redeem`, {}, config);
    return extractApiResponse(response);
  } catch (error) {
    console.error(`Error redeeming voucher with code ${code}:`, error);
    throw error;
  }
};

/**
 * Resend customer email
 */
export const resendCustomerEmail = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    // Using a more standard API path structure
    await axios.post(`/orders/${id}/emails/customer`, {}, config);
  } catch (error) {
    console.error(`Error resending customer email for order ${id}:`, error);
    throw error;
  }
};

/**
 * Resend receiver email
 */
export const resendReceiverEmail = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    // Using a more standard API path structure
    await axios.post(`/orders/${id}/emails/receiver`, {}, config);
  } catch (error) {
    console.error(`Error resending receiver email for order ${id}:`, error);
    throw error;
  }
};

/**
 * Resend store email
 */
export const resendStoreEmail = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    // Using a more standard API path structure
    await axios.post(`/orders/${id}/emails/store`, {}, config);
  } catch (error) {
    console.error(`Error resending store email for order ${id}:`, error);
    throw error;
  }
};

/**
 * Resend all emails
 */
export const resendAllEmails = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    // Using a more standard API path structure
    await axios.post(`/orders/${id}/emails/all`, {}, config);
  } catch (error) {
    console.error(`Error resending all emails for order ${id}:`, error);
    throw error;
  }
};

/**
 * Generate voucher PDF
 */
export const generateVoucherPdf = async (id: string): Promise<string> => {
  try {
    const config = getApiConfig();
    // Using a more standard API path structure
    const response = await axios.get(`/orders/${id}/pdf`, config);
    
    console.log(`API PDF response:`, response.data);
    
    // Different APIs might have different formats
    if (response.data) {
      // Case 1: Format is using extractApiResponse
      try {
        return extractApiResponse(response);
      } catch (extractError) {
        console.warn('Could not use extractApiResponse, falling back to direct data access');
        
        // Case 2: Data is directly in response.data
        if (typeof response.data === 'string') {
          return response.data;
        }
        
        // Case 3: Data is in response.data.url or similar field
        if (response.data.url) {
          return response.data.url;
        }
        
        if (response.data.data && response.data.data.url) {
          return response.data.data.url;
        }
        
        if (response.data.pdfUrl) {
          return response.data.pdfUrl;
        }
      }
    }
    
    throw new Error(`Invalid API response format for PDF generation of order ${id}`);
  } catch (error) {
    console.error(`Error generating PDF for order ${id}:`, error);
    throw error;
  }
};

/**
 * Download voucher PDF
 */
export const downloadVoucherPdf = async (id: string): Promise<void> => {
  try {
    const pdfUrl = await generateVoucherPdf(id);
    
    // Create a hidden anchor element
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank'; // Optional: Open in new tab
    link.download = `voucher-${id}.pdf`;
    
    // Append to body, click and then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(`Error downloading PDF for order ${id}:`, error);
    throw error;
  }
}; 