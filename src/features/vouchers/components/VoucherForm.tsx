import React, { useEffect, useState } from 'react'
import { 
  Form, 
  Input, 
  Button, 
  InputNumber, 
  Select, 
  DatePicker, 
  Space, 
  Row, 
  Col, 
} from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import dayjs from '@/utils/dayjs'
import { getStores } from '@/features/stores/services/storeService'
import { getProducts } from '@/features/product/services/productService'
import { getUsers } from '@/features/users/services/userService'
import { VoucherFormData, Voucher } from '../types'
import { Store } from '@/features/stores/types'
import { Product } from '@/features/product/types'
import { User } from '@/features/users/types'
import { isBeforeToday } from '@/utils/dateUtils'

const { TextArea } = Input


interface VoucherFormProps {
  initialValues?: Voucher
  onSubmit: (values: VoucherFormData) => void
  loading: boolean
}

const TEMPLATE_OPTIONS = [
  { label: 'Template 1', value: 'template1' },
  { label: 'Template 2', value: 'template2' },
  { label: 'Template 3', value: 'template3' },
  { label: 'Template 4', value: 'template4' },
  { label: 'Template 5', value: 'template5' }
]

const validateDate = (date: any): boolean => {
  if (!date) return false;
  if (dayjs.isDayjs(date)) return date.isValid();
  return dayjs(date, 'YYYY-MM-DD').isValid();
};

const VoucherForm: React.FC<VoucherFormProps> = ({
  initialValues,
  onSubmit,
  loading
}) => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(initialValues?.storeId)
  
  // Fetch stores for dropdown
  const { data: storesData, isLoading: loadingStores } = useQuery({
    queryKey: ['stores-dropdown'],
    queryFn: () => getStores(1, 100),
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  })
  
  // Fetch products for the selected store
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['products-dropdown', selectedStoreId],
    queryFn: async () => {
      if (!selectedStoreId) {
        return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
      }
      return getProducts(1, 100, `storeId:${selectedStoreId}`); 
    },
    refetchOnWindowFocus: false,
    staleTime: 60000,
    enabled: !!selectedStoreId
  })
  
  // Fetch customers (users with customer role)
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['customers-dropdown'],
    queryFn: () => getUsers(1, 100),
    refetchOnWindowFocus: false,
    staleTime: 60000
  })
  
  // Extract data for dropdowns
  const stores = storesData?.data || []
  const products = productsData?.data || []
  const customers = (usersData?.data || []).filter(user => user.role === 'customer')
  
  // Generate options for dropdowns
  const storeOptions = stores.map((store: Store) => ({
    label: store.name,
    value: store._id || store.id || ''
  }))
  
  const productOptions = products.map((product: Product) => ({
    label: `${product.name} - $${product.price}`,
    value: product._id || product.id || ''
  }))
  
  const customerOptions = customers.map((user: User) => ({
    label: `${user.name} (${user.email})`,
    value: user.id || ''
  }))

  // Handle store selection change
  const handleStoreChange = (value: string) => {
    setSelectedStoreId(value)
    form.setFieldsValue({ productId: undefined })
  }

  // Set form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      console.log("Original initialValues:", initialValues);
      setSelectedStoreId(initialValues.storeId);
      
      try {
        // Parse date in simple format
        const formattedValues = {
          ...initialValues,
          expirationDate: initialValues.expirationDate ? dayjs(initialValues.expirationDate) : undefined
        };
        
        console.log("Formatted values:", formattedValues);
        form.setFieldsValue(formattedValues);
      } catch (error) {
        console.error("Error setting form values:", error);
      }
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    console.log("Form values on submit:", values);
    
    const formattedValues: VoucherFormData = {
      ...values,
      expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : undefined
    };
    
    console.log("Formatted values for submission:", formattedValues);
    onSubmit(formattedValues);
  };

  const handleCancel = () => {
    router.push('/dashboard/vouchers')
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        template: 'template1',
        ...initialValues
      }}
    >
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
              onChange={handleStoreChange}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true, message: 'Please select a product' }]}
          >
            <Select
              placeholder={selectedStoreId ? "Select a product" : "Select a store first"}
              options={productOptions}
              loading={loadingProducts}
              disabled={!selectedStoreId}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="customerId"
            label="Customer (Optional)"
          >
            <Select
              placeholder="Select a customer (optional)"
              options={customerOptions}
              loading={loadingUsers}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: 'Please enter the voucher amount' },
              { type: 'number', min: 0, message: 'Amount must be a positive number' }
            ]}
          >
            <InputNumber 
              style={{ width: '100%' }}
              placeholder="Enter amount"
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
            name="expirationDate"
            label="Expiration Date"
            rules={[{ required: true, message: 'Please select an expiration date' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="YYYY-MM-DD"
              disabledDate={isBeforeToday}
              allowClear={false}
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="template"
            label="Template"
            rules={[{ required: true, message: 'Please select a template' }]}
          >
            <Select
              placeholder="Select a template"
              options={TEMPLATE_OPTIONS}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="senderName"
            label="Sender Name"
            rules={[{ required: true, message: 'Please enter sender name' }]}
          >
            <Input placeholder="Enter sender name" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="senderEmail"
            label="Sender Email"
            rules={[
              { required: true, message: 'Please enter sender email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter sender email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="receiverName"
            label="Receiver Name"
            rules={[{ required: true, message: 'Please enter receiver name' }]}
          >
            <Input placeholder="Enter receiver name" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="receiverEmail"
            label="Receiver Email"
            rules={[
              { required: true, message: 'Please enter receiver email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter receiver email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="message"
            label="Message"
            rules={[
              { required: true, message: 'Please enter a message' },
              { max: 500, message: 'Message must be maximum 500 characters' }
            ]}
          >
            <TextArea 
              placeholder="Enter gift message" 
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Update Voucher' : 'Create Voucher'}
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default VoucherForm 