import { AxiosResponse } from 'axios';

/**
 * Extracts data from API responses with consistent handling of different response structures.
 * Our API returns data in different formats:
 * 1. { data: actualData, status: "success" }
 * 2. { voucher: actualData }
 * 3. { order: { voucher: actualData } }
 * 4. Direct data object
 * 
 * @param response - The Axios response object
 * @returns The actual data payload from the response
 */
export const extractApiResponse = <T>(response: AxiosResponse): T => {
  const responseData = response.data;
  console.log('Extracting API response:', responseData);

  // Case 1: Standard API response { data: actualData, status: "success" }
  if (responseData?.data !== undefined) {
    console.log('Found standard API response structure');
    return responseData.data as T;
  }

  // Case 2: Voucher-specific response { voucher: actualData }
  if (responseData?.voucher !== undefined) {
    console.log('Found voucher-specific response structure');
    return responseData.voucher as T;
  }

  // Case 3: Order response with voucher { order: { voucher: actualData } }
  if (responseData?.order?.voucher !== undefined) {
    console.log('Found order response with voucher structure');
    return responseData.order.voucher as T;
  }

  // Case 4: Direct data object
  console.log('Using direct response data');
  return responseData as T;
}; 