import axios from 'axios'
import { API_URL } from '@/config/constants'
import Cookies from 'js-cookie'
import { AuthSession, UserInfo } from '../types'
import { extractApiResponse } from '@/utils/apiUtils'

// Set up axios defaults with API key
axios.defaults.headers.common['X-API-Key'] = process.env.NEXT_PUBLIC_API_KEY

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: UserInfo
  token: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user?: UserInfo
    token?: string
  }
}

// Custom authentication service without NextAuth
export const authService = {
  // Login function that uses your API
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // For development, allow a demo login
      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        const mockResponse = {
          user: {
            id: '1',
            name: 'Demo Admin',
            email: 'admin@example.com',
            role: 'admin'
          },
          token: 'demo-token'
        };
        
        // Store in both localStorage and cookies
        localStorage.setItem('auth_token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        // Set cookie for middleware
        Cookies.set('auth_token', mockResponse.token, { expires: 1, path: '/' }); // 1 day expiry
        
        return mockResponse;
      }
      
      // Your real API call
      const response = await axios.post(`${API_URL}/users/login`, credentials, {
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY
        }
      })
      
      // Check if the response has the expected structure
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Login failed')
      }
      
      // Extract user and token from the response data
      const { token, user } = response.data.data
      
      if (!token || !user) {
        throw new Error('Invalid response format: missing token or user data')
      }
      
      // Store in both localStorage and cookies
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Set cookie for middleware
      Cookies.set('auth_token', token, { expires: 1, path: '/' }) // 1 day expiry
      
      return { user, token }
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data?.message || 'Login failed')
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please try again.')
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(error.message || 'Login failed')
      }
    }
  },
  
  // Logout function
  logout() {
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    
    // Clear cookie
    Cookies.remove('auth_token', { path: '/' })
    
    // Redirect to login
    window.location.href = '/auth/login'
  },
  
  // Get current user session
  getSession(): AuthSession | null {
    try {
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('user')
      
      if (!token || !userStr) {
        return null
      }
      
      const user = JSON.parse(userStr)
      
      return {
        user,
        accessToken: token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  },
  
  // Get the authentication token
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },
  
  // Set up axios interceptor to add auth token to all requests
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        // Ensure API key is always present
        config.headers['X-API-Key'] = process.env.NEXT_PUBLIC_API_KEY
        return config
      },
      (error) => Promise.reject(error)
    )
  }
}

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData)
    
    if (response.data.status === 'success') {
      const responseData = extractApiResponse<{ user: UserInfo; token: string }>(response)
      
      return {
        success: true,
        message: 'User registered successfully',
        data: responseData
      }
    }
    
    return {
      success: false,
      message: response.data.message || 'Registration failed'
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred during registration'
    }
  }
} 