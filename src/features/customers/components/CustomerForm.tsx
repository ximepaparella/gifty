import React, { useEffect } from 'react'
import { Form, Input, Button, Row, Col, Card, Space } from 'antd'
import { Customer, CustomerFormData } from '../types'
import { useRouter } from 'next/router'

interface CustomerFormProps {
  initialValues?: Customer
  onSubmit: (values: CustomerFormData) => Promise<void>
  isLoading: boolean
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  initialValues,
  onSubmit,
  isLoading
}) => {
  const [form] = Form.useForm()
  const router = useRouter()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        fullName: initialValues.fullName,
        email: initialValues.email,
        phoneNumber: initialValues.phoneNumber,
        address: initialValues.address,
        city: initialValues.city,
        zipCode: initialValues.zipCode,
        country: initialValues.country
      })
    }
  }, [initialValues, form])

  const handleSubmit = async (values: CustomerFormData) => {
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <Card title="Customer Information">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: 'Full name is required' },
                { min: 2, message: 'Full name must be at least 2 characters' },
                { max: 50, message: 'Full name cannot exceed 50 characters' }
              ]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { required: true, message: 'Phone number is required' },
                { pattern: /^[0-9+\-() ]*$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[
                { required: true, message: 'Address is required' }
              ]}
            >
              <Input placeholder="Enter address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="city"
              label="City"
              rules={[
                { required: true, message: 'City is required' }
              ]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="zipCode"
              label="ZIP Code"
              rules={[
                { required: true, message: 'ZIP code is required' }
              ]}
            >
              <Input placeholder="Enter ZIP code" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="country"
              label="Country"
              rules={[
                { required: true, message: 'Country is required' }
              ]}
            >
              <Input placeholder="Enter country" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {initialValues ? 'Update Customer' : 'Create Customer'}
            </Button>
            <Button onClick={() => router.push('/dashboard/customers')}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default CustomerForm 