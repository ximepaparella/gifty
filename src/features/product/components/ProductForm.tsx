import React, { useEffect, useState } from 'react'
import { Form, Input, Button, InputNumber, Select, Switch, Space, Row, Col, Typography } from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { getStores } from '@/features/stores/services/storeService'
import { ProductFormData, Product } from '../types'
import { Store } from '@/features/stores/types'

const { TextArea } = Input

interface ProductFormProps {
  initialValues?: Product
  onSubmit: (values: ProductFormData) => void
  loading: boolean
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  loading
}) => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [storeOptions, setStoreOptions] = useState<{ label: string; value: string }[]>([])

  // Fetch stores for dropdown
  const { data: storesData, isLoading: loadingStores } = useQuery({
    queryKey: ['stores-dropdown'],
    queryFn: () => getStores(1, 100),
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  })
  
  // Extract stores for dropdown
  const stores = storesData?.data || []

  // Generate store options for dropdown
  useEffect(() => {
    if (stores.length > 0) {
      const options = stores.map((store: Store) => ({
        label: store.name,
        value: store._id || store.id || ''
      }))
      setStoreOptions(options)
    }
  }, [stores])

  // Set form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        // Use the appropriate ID (either _id or id)
        storeId: initialValues.storeId || initialValues._id || initialValues.id
      })
    }
  }, [initialValues, form])

  const handleFinish = (values: ProductFormData) => {
    onSubmit(values)
  }

  const handleCancel = () => {
    router.push('/dashboard/products')
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        isActive: true,
        ...initialValues
      }}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="Enter product name" maxLength={100} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter product description' }]}
          >
            <TextArea 
              placeholder="Enter product description"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={1000}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="storeId"
            label="Store"
            rules={[{ required: true, message: 'Please select a store' }]}
          >
            <Select
              placeholder="Select a store"
              options={storeOptions}
              loading={loadingStores}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Please enter product price' },
              { type: 'number', min: 0, message: 'Price must be a positive number' }
            ]}
          >
            <InputNumber 
              style={{ width: '100%' }}
              placeholder="Enter price"
              prefix="$"
              precision={2}
              min={0}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Update Product' : 'Create Product'}
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default ProductForm 