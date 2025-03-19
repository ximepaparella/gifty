import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { ConfigProvider } from 'antd'
import antdTheme from '@/styles/antdTheme'
import '@/styles/globals.css'

// Create a client
const queryClient = new QueryClient()

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={antdTheme}>
          <Component {...pageProps} />
        </ConfigProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
} 