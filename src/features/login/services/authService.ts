import axios from 'axios'
import { API_URL } from '@/config/constants'

export interface LoginCredentials {
  email: string
  password: string
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
    user?: {
      id: string
      name: string
      email: string
      role: string
    }
    token?: string
  }
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials)
    
    if (response.data.status === 'success') {
      return {
        success: true,
        message: 'Login successful',
        data: response.data.data
      }
    }
    
    return {
      success: false,
      message: response.data.message || 'Login failed'
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred during login'
    }
  }
}

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData)
    
    if (response.data.status === 'success') {
      return {
        success: true,
        message: 'User registered successfully',
        data: response.data.data
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