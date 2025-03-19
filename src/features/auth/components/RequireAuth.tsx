import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Spin } from 'antd'
import { authService } from '../services/authService'

interface RequireAuthProps {
  children: ReactNode
  allowedRoles?: string[]
}

/**
 * A component that requires authentication to render its children
 * Redirects to login if not authenticated
 * Can also check for specific roles if allowedRoles is provided
 */
const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  
  // Check authentication on mount
  useEffect(() => {
    // Skip if already checked
    if (authChecked) return
    
    // Skip check if on login page
    if (router.pathname.includes('/auth/login')) {
      setAuthorized(true)
      setAuthChecked(true)
      return
    }
    
    // Get session from our custom auth service
    const session = authService.getSession()
    
    // If not authenticated, redirect to login
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    // Check role-based access if needed
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = session.user.role
      if (!allowedRoles.includes(userRole)) {
        router.push('/dashboard')
        return
      }
    }
    
    // User is authorized
    setAuthorized(true)
    setAuthChecked(true)
  }, [router, allowedRoles, authChecked, router.pathname])
  
  // Show loading indicator while checking auth
  if (!authorized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }
  
  return <>{children}</>
}

export default RequireAuth 