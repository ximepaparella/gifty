import axios from 'axios'
import { API_URL } from '@/config/constants'
import { getSession } from 'next-auth/react'
import dashboardData from '@/mockups/dashboardData'

// This is a mock service for now, but in the future, it will make real API calls
export const fetchDashboardData = async () => {
  try {
    // Get the session to access the auth token
    const session = await getSession()
    
    if (!session?.accessToken) {
      throw new Error('No access token available')
    }
    
    // In a real implementation, we would make an API call like this:
    /*
    const response = await axios.get(`${API_URL}/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })
    
    return response.data
    */
    
    // For now, return mock data
    return dashboardData
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Return mock data as fallback
    return dashboardData
  }
}

// Function to create an API instance with the auth token
export const createAuthenticatedApi = async () => {
  const session = await getSession()
  
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.accessToken}`
    }
  })
} 