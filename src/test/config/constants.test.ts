describe('Constants Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('API_URL Configuration', () => {
    it('should use NEXT_PUBLIC_API_URL in production when available', () => {
      Object.defineProperty(process, 'env', {
        value: {
          ...process.env,
          NODE_ENV: 'production',
          NEXT_PUBLIC_API_URL: 'https://api.example.com'
        }
      });
      
      const { API_URL } = require('@/config/constants');
      expect(API_URL).toBe('https://api.example.com');
    });

    it('should throw error in production when NEXT_PUBLIC_API_URL is missing', () => {
      Object.defineProperty(process, 'env', {
        value: {
          ...process.env,
          NODE_ENV: 'production'
        }
      });

      expect(() => {
        require('@/config/constants');
      }).toThrow('API configuration error: Missing NEXT_PUBLIC_API_URL environment variable');
    });

    it('should use NEXT_PUBLIC_API_URL in development when available', () => {
      Object.defineProperty(process, 'env', {
        value: {
          ...process.env,
          NODE_ENV: 'development',
          NEXT_PUBLIC_API_URL: 'https://dev-api.example.com'
        }
      });
      
      const { API_URL } = require('@/config/constants');
      expect(API_URL).toBe('https://dev-api.example.com');
    });

    it('should use default localhost URL in development when NEXT_PUBLIC_API_URL is missing', () => {
      Object.defineProperty(process, 'env', {
        value: {
          ...process.env,
          NODE_ENV: 'development'
        }
      });
      
      const { API_URL } = require('@/config/constants');
      expect(API_URL).toBe('http://localhost:3000/api/v1');
    });

    it('should handle test environment like development', () => {
      Object.defineProperty(process, 'env', {
        value: {
          ...process.env,
          NODE_ENV: 'test'
        }
      });
      
      const { API_URL } = require('@/config/constants');
      expect(API_URL).toBe('http://localhost:3000/api/v1');
    });
  });
}); 