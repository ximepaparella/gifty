import { authService, register } from '@/features/auth/services/authService';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '@/config/constants';

// Mock axios and js-cookie
jest.mock('axios');
jest.mock('js-cookie');

describe('Auth Service', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  };

  const mockToken = 'test-token';

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
    // Reset axios mocks
    (axios.post as jest.Mock).mockReset();
    // Reset cookie mocks
    (Cookies.set as jest.Mock).mockReset();
  });

  describe('login', () => {
    it('should handle demo login successfully', async () => {
      const credentials = {
        email: 'admin@example.com',
        password: 'password'
      };

      const result = await authService.login(credentials);

      expect(result).toEqual({
        user: {
          id: '1',
          name: 'Demo Admin',
          email: 'admin@example.com',
          role: 'admin'
        },
        token: 'demo-token'
      });

      expect(localStorage.getItem('auth_token')).toBe('demo-token');
      expect(JSON.parse(localStorage.getItem('user') || '')).toEqual({
        id: '1',
        name: 'Demo Admin',
        email: 'admin@example.com',
        role: 'admin'
      });
      expect(Cookies.set).toHaveBeenCalledWith('auth_token', 'demo-token', { expires: 1, path: '/' });
    });

    it('should handle regular login successfully', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'password'
      };

      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          status: 'success',
          data: {
            user: mockUser,
            token: mockToken
          }
        }
      });

      const result = await authService.login(credentials);

      expect(result).toEqual({
        user: mockUser,
        token: mockToken
      });

      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/login`, credentials);
      expect(localStorage.getItem('auth_token')).toBe(mockToken);
      expect(JSON.parse(localStorage.getItem('user') || '')).toEqual(mockUser);
      expect(Cookies.set).toHaveBeenCalledWith('auth_token', mockToken, { expires: 1, path: '/' });
    });

    it('should handle login failure', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'wrong'
      };

      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));

      await expect(authService.login(credentials)).rejects.toThrow('Login failed');
    });
  });

  describe('logout', () => {
    it('should clear auth data and redirect', () => {
      // Setup initial state
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Mock window.location
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true
      });

      authService.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(Cookies.remove).toHaveBeenCalledWith('auth_token', { path: '/' });
      expect(mockLocation.href).toBe('/auth/login');
    });
  });

  describe('getSession', () => {
    it('should return null when no session exists', () => {
      const session = authService.getSession();
      expect(session).toBeNull();
    });

    it('should return session when valid data exists', () => {
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      const session = authService.getSession();

      expect(session).toEqual({
        user: mockUser,
        accessToken: mockToken,
        expires: expect.any(String)
      });
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(authService.isAuthenticated()).toBeFalsy();
    });

    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', mockToken);
      expect(authService.isAuthenticated()).toBeTruthy();
    });
  });

  describe('register', () => {
    const registerData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      role: 'user'
    };

    it('should handle successful registration', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          status: 'success',
          data: {
            user: mockUser,
            token: mockToken
          }
        }
      });

      const result = await register(registerData);

      expect(result).toEqual({
        success: true,
        message: 'User registered successfully',
        data: {
          user: mockUser,
          token: mockToken
        }
      });

      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/users`, registerData);
    });

    it('should handle registration failure', async () => {
      const errorMessage = 'Email already exists';
      (axios.post as jest.Mock).mockRejectedValueOnce({
        response: {
          data: {
            message: errorMessage
          }
        }
      });

      const result = await register(registerData);

      expect(result).toEqual({
        success: false,
        message: errorMessage
      });
    });
  });
}); 