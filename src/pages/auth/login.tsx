import { useState, useEffect } from 'react'
import { Form, Input, Button, Card, Typography, Space, App } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import FullWidthLayout from '@/layouts/FullWidthLayout'
import { LoginCredentials, authService } from '@/features/auth/services/authService'

const { Title, Text } = Typography

export default function Login() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { notification } = App.useApp()
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])
  
  const onFinish = async (values: LoginCredentials) => {
    try {
      setLoading(true)
      
      await authService.login(values)
      
      notification.success({
        message: 'Login Successful',
        description: 'You are now being redirected to the dashboard.'
      })
      
      // Add a slight delay to allow the notification to show
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
      
    } catch (error: any) {
      notification.error({
        message: 'Login Failed',
        description: error.message || 'Invalid email or password. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <Head>
        <title>Login | Gifty Platform</title>
      </Head>
      <FullWidthLayout>
        <Card 
          style={{ width: '100%', maxWidth: 400 }}
          bordered={false}
          className="login-card"
        >
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <Title level={2}>Welcome to Gifty</Title>
            <Text type="secondary">Login to your account</Text>
            
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              style={{ width: '100%', marginTop: 24 }}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Email" 
                  size="large" 
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Password" 
                  size="large" 
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  block
                  loading={loading}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
            
            <Text>
              Don't have an account? <Link href="/auth/register">Register</Link>
            </Text>
          </Space>
        </Card>
      </FullWidthLayout>
    </>
  )
} 