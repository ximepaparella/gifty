import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Spin } from 'antd'
import { authService } from '@/features/auth/services/authService'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const session = authService.getSession()
    
    if (session) {
      router.replace('/dashboard')
    } else {
      router.replace('/auth/login')
    }
    
    setIsLoading(false)
  }, [router])

  // Show loading state while checking authentication
  return (
    <>
      <Head>
        <title>Gifty - Gift Vouchers Platform</title>
        <meta name="description" content="Create, sell, and manage gift vouchers for your business" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f0f2f5'
      }}>
        <Spin size="large" tip="Loading..." />
      </div>
    </>
  )
} 