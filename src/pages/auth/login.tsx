import { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import FullWidthLayout from '@/layouts/FullWidthLayout'
import { LoginCredentials } from '@/features/login/services/authService'

const { Title, Text } = Typography

export default function Login() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const onFinish = async (values: LoginCredentials) => {
    setLoading(true)
    
    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    })
    
    if (result?.error) {
      message.error('Invalid email or password')
    } else {
      message.success('Login successful')
      router.push('/dashboard')
    }
    
    setLoading(false)
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