import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { ConfigProvider, App as AntApp } from 'antd'
import antdTheme from '@/styles/antdTheme'
import { useEffect } from 'react'
import { authService } from '@/features/auth/services/authService'
// Import the dayjs configuration
import '@/utils/dayjs'
import '@/styles/globals.css'
// Import Tailwind CSS for client pages
import '@/styles/tailwind.css'

// Create a client
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  // Set up axios interceptors for auth on initial load
  useEffect(() => {
    authService.setupAxiosInterceptors()
  }, [])
  
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider 
        theme={antdTheme}
        virtual={false} // Prevents the unique key warning in tables
      >
        <AntApp>
          <Component {...pageProps} />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  )
} 