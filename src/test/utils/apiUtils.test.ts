import { extractApiResponse } from '@/utils/apiUtils';
import { AxiosResponse } from 'axios';

describe('API Utils', () => {
  describe('extractApiResponse', () => {
    it('should extract data from standard API response structure', () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            id: 1,
            name: 'Test'
          }
        }
      } as AxiosResponse;

      const result = extractApiResponse(mockResponse);
      expect(result).toEqual({
        id: 1,
        name: 'Test'
      });
    });

    it('should handle response with direct data structure', () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'Test'
        }
      } as AxiosResponse;

      const result = extractApiResponse(mockResponse);
      expect(result).toEqual({
        id: 1,
        name: 'Test'
      });
    });

    it('should handle response with null data', () => {
      const mockResponse = {
        data: null
      } as AxiosResponse;

      const result = extractApiResponse(mockResponse);
      expect(result).toBeNull();
    });

    it('should handle response with array data', () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: [
            { id: 1, name: 'Test 1' },
            { id: 2, name: 'Test 2' }
          ]
        }
      } as AxiosResponse;

      const result = extractApiResponse<Array<{ id: number; name: string }>>(mockResponse);
      expect(result).toEqual([
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' }
      ]);
    });

    it('should handle response with empty data object', () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {}
        }
      } as AxiosResponse;

      const result = extractApiResponse(mockResponse);
      expect(result).toEqual({});
    });

    it('should handle response with data property set to undefined', () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: undefined
        }
      } as AxiosResponse;

      const result = extractApiResponse(mockResponse);
      expect(result).toEqual({ status: 'success', data: undefined });
    });

    it('should handle response with primitive data types', () => {
      const mockStringResponse = {
        data: {
          status: 'success',
          data: 'test string'
        }
      } as AxiosResponse;

      const mockNumberResponse = {
        data: {
          status: 'success',
          data: 42
        }
      } as AxiosResponse;

      const mockBooleanResponse = {
        data: {
          status: 'success',
          data: true
        }
      } as AxiosResponse;

      expect(extractApiResponse(mockStringResponse)).toBe('test string');
      expect(extractApiResponse(mockNumberResponse)).toBe(42);
      expect(extractApiResponse(mockBooleanResponse)).toBe(true);
    });
  });
}); 