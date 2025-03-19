import dashboardData from '@/mockups/dashboardData'

// Direct sync implementation to avoid any async issues
export const fetchDashboardData = () => {
  return dashboardData
} 