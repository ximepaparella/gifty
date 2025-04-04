import axios from 'axios';
import { authService } from '@/features/auth/services/authService';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/features/products/services/productService';

// Mock axios and auth service
jest.mock('axios');
jest.mock('@/features/auth/services/authService');

describe('Product Service', () => {
  const mockToken = 'test-token';
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    image: 'test-image.jpg',
    category: 'test-category',
    stock: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authService.getToken as jest.Mock).mockReturnValue(mockToken);
  });

  describe('getProducts', () => {
    it('should fetch products successfully', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: [mockProduct],
          pagination: {
            total: 1,
            page: 1,
            limit: 10,
          },
        },
      };

      (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getProducts();

      expect(result).toEqual({
        data: [mockProduct],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
        },
      });

      expect(axios.get).toHaveBeenCalledWith(
        '/products?page=1&limit=10',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it('should handle pagination and sorting', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: [mockProduct],
          pagination: {
            total: 1,
            page: 2,
            limit: 5,
          },
        },
      };

      (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      await getProducts(2, 5, 'name');

      expect(axios.get).toHaveBeenCalledWith(
        '/products?page=2&limit=5&sort=name',
        expect.any(Object)
      );
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Network error';
      (axios.get as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(getProducts()).rejects.toThrow(errorMessage);
    });
  });

  describe('getProductById', () => {
    it('should fetch a single product successfully', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: mockProduct,
        },
      };

      (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getProductById('1');

      expect(result).toEqual(mockProduct);
      expect(axios.get).toHaveBeenCalledWith(
        '/products/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Product not found';
      (axios.get as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(getProductById('999')).rejects.toThrow(errorMessage);
    });
  });

  describe('createProduct', () => {
    const mockFormData = {
      name: 'New Product',
      description: 'New Description',
      price: 149.99,
      category: 'new-category',
      stock: 5,
      storeId: 'store-1',
    };

    it('should create product without image', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: { ...mockFormData, id: '2' },
        },
      };

      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await createProduct(mockFormData);

      expect(result).toEqual({ ...mockFormData, id: '2' });
      expect(axios.post).toHaveBeenCalledWith(
        '/products',
        mockFormData,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should create product with image', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockFormDataWithImage = { ...mockFormData, image: mockFile };

      const mockResponse = {
        data: {
          status: 'success',
          data: { ...mockFormData, id: '2', image: 'test.jpg' },
        },
      };

      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await createProduct(mockFormDataWithImage);

      expect(result).toEqual({ ...mockFormData, id: '2', image: 'test.jpg' });
      expect(axios.post).toHaveBeenCalledWith(
        '/products',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
          }),
        })
      );
    });
  });

  describe('updateProduct', () => {
    const mockUpdateData = {
      name: 'Updated Product',
      price: 199.99,
      storeId: 'store-1',
    };

    it('should update product without image', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: { ...mockProduct, ...mockUpdateData },
        },
      };

      (axios.put as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await updateProduct('1', mockUpdateData);

      expect(result).toEqual({ ...mockProduct, ...mockUpdateData });
      expect(axios.put).toHaveBeenCalledWith(
        '/products/1',
        mockUpdateData,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should update product with image', async () => {
      const mockFile = new File(['test'], 'updated.jpg', { type: 'image/jpeg' });
      const mockUpdateDataWithImage = { ...mockUpdateData, image: mockFile };

      const mockResponse = {
        data: {
          status: 'success',
          data: { ...mockProduct, ...mockUpdateData, image: 'updated.jpg' },
        },
      };

      (axios.put as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await updateProduct('1', mockUpdateDataWithImage);

      expect(result).toEqual({ ...mockProduct, ...mockUpdateData, image: 'updated.jpg' });
      expect(axios.put).toHaveBeenCalledWith(
        '/products/1',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
          }),
        })
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      (axios.delete as jest.Mock).mockResolvedValueOnce({});

      await deleteProduct('1');

      expect(axios.delete).toHaveBeenCalledWith(
        '/products/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it('should handle delete error', async () => {
      const errorMessage = 'Product not found';
      (axios.delete as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(deleteProduct('999')).rejects.toThrow(errorMessage);
    });
  });
}); 