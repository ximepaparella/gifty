import { Space, Typography } from 'antd'
import Head from 'next/head'
import Link from 'next/link'

const { Title } = Typography

export default function Home() {
  return (
    <>
      <Head>
        <title>Gifty - Gift Vouchers Platform</title>
        <meta name="description" content="Create, sell, and manage gift vouchers for your business" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Title>Welcome to Gifty</Title>
        <Title level={2}>Your Gift Vouchers Platform</Title>
        <Space>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
        <Link href="/dashboard">Dashboard</Link>
      </Space>
      </main>
    </>
  )
} 