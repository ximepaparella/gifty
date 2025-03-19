import { AxiosResponse } from 'axios';

/**
 * Extracts data from API responses with consistent handling of different response structures.
 * Our API typically returns { data: actualData, status: "success" }, but sometimes returns data directly.
 * This helper handles both cases.
 * 
 * @param response - The Axios response object
 * @returns The actual data payload from the response
 */
export const extractApiResponse = <T>(response: AxiosResponse): T => {
  // Check if response follows { data: actualData, status: "success" } structure
  if (response.data && 
      typeof response.data === 'object' && 
      'data' in response.data && 
      response.data.data !== undefined) {
    return response.data.data as T;
  }
  
  // Fallback to returning the entire data object
  return response.data as T;
}; 