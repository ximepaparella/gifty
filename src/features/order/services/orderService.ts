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
 * Resend all emails for an order
 */
export const resendAllEmails = async (id: string): Promise<void> => {
  try {
    const config = getApiConfig();
    console.log(`Resending all emails for order ${id}`);
    
    // Try different endpoint formats
    try {
      // First, try the v1 API format
      await axios.post(`/orders/${id}/resend-emails`, {}, config);
      console.log(`Successfully requested resend of all emails for order ${id} using standard endpoint`);
      return;
    } catch (standardError) {
      console.log(`Standard API endpoint failed, trying v1 endpoint`);
      
      // Try the v1 endpoint format
      await axios.post(`/api/v1/orders/${id}/resend-emails`, {}, config);
      console.log(`Successfully requested resend of all emails for order ${id} using v1 endpoint`);
    }
  } catch (error) {
    console.error(`Error resending all emails for order ${id}:`, error);
    
    // Log more detailed error information
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    throw error;
  }
};

/**
 * Generate voucher PDF
 */
export const generateVoucherPdf = async (id: string): Promise<string> => {
  try {
    const config = getApiConfig();
    // First, get the order to obtain the pdfUrl
    const order = await getOrderById(id);
    console.log(`Retrieved order for PDF generation:`, order);
    
    // Check if order has a pdfUrl field
    if (order.pdfUrl) {
      console.log(`Found pdfUrl in order: ${order.pdfUrl}`);
      // If pdfUrl is relative, prepend the base URL
      if (order.pdfUrl.startsWith('/')) {
        const baseApiUrl = config.baseURL || '';
        return `${baseApiUrl}${order.pdfUrl}`;
      }
      return order.pdfUrl;
    }
    
    // Fallback: try to generate PDF using the API endpoint
    console.log(`No pdfUrl found in order, trying API endpoint`);
    
    // Try different endpoint formats since the API might have changed
    // First try the v1 API format
    try {
      const pdfResponse = await axios.get(`/api/v1/orders/${id}/download-pdf`, config);
      console.log('PDF response from v1 API:', pdfResponse.data);
      
      if (pdfResponse.data && (pdfResponse.data.url || pdfResponse.data.pdfUrl)) {
        return pdfResponse.data.url || pdfResponse.data.pdfUrl;
      }
    } catch (pdfError) {
      console.log(`v1 API endpoint failed, trying standard endpoint`);
      // Try the standard endpoint format
      try {
        const pdfResponse = await axios.get(`/orders/${id}/generate-pdf`, config);
        console.log('PDF response from standard API:', pdfResponse.data);
        
        if (pdfResponse.data && (pdfResponse.data.url || pdfResponse.data.pdfUrl)) {
          return pdfResponse.data.url || pdfResponse.data.pdfUrl;
        }
      } catch (standardPdfError) {
        console.log('Standard API endpoint also failed');
      }
    }
    
    // As a last resort, try a POST request instead of GET
    try {
      console.log(`Trying POST request to generate PDF`);
      const pdfResponse = await axios.post(`/orders/${id}/pdf`, {}, config);
      console.log('PDF response from POST request:', pdfResponse.data);
      
      if (pdfResponse.data && (pdfResponse.data.url || pdfResponse.data.pdfUrl)) {
        return pdfResponse.data.url || pdfResponse.data.pdfUrl;
      }
    } catch (postError) {
      console.log('POST request also failed');
    }
    
    throw new Error(`Could not generate PDF for order ${id}. Please check API endpoints.`);
  } catch (error) {
    console.error(`Error getting PDF URL for order ${id}:`, error);
    throw error;
  }
};

/**
 * Download voucher PDF
 */
export const downloadVoucherPdf = async (id: string): Promise<void> => {
  try {
    console.log(`Starting PDF download process for order ${id}`);
    const pdfUrl = await generateVoucherPdf(id);
    console.log(`Downloading PDF from URL: ${pdfUrl}`);
    
    // Extract the filename from the URL, or use the voucher code if available
    let filename = `voucher-${id}.pdf`;
    
    // Try to extract a better filename from the URL
    if (pdfUrl) {
      const urlParts = pdfUrl.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart.includes('.')) {
        filename = lastPart;
      }
    }
    
    console.log(`Using filename: ${filename}`);
    
    // Create a hidden anchor element
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.download = filename;
    link.style.display = 'none';
    
    // Append to body, click and then remove
    document.body.appendChild(link);
    console.log('Triggering download...');
    link.click();
    
    // Small timeout before removing the link to ensure the download starts
    setTimeout(() => {
      document.body.removeChild(link);
      console.log('Download link removed from DOM');
    }, 100);
  } catch (error) {
    console.error(`Error downloading PDF for order ${id}:`, error);
    throw error;
  }
}; 