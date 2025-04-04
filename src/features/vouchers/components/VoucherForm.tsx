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
  Card,
  Divider
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
import { 
  formatDateString, 
  isValidDate, 
  isDateInFuture, 
  getTomorrowDateString, 
  getThreeMonthsFromNow, 
  getSixMonthsFromNow 
} from '@/utils/dateUtils'
import dynamic from 'next/dynamic'

const { TextArea } = Input

// Dynamically import templates for preview
const Template1 = dynamic(() => import('@/pages/dashboard/vouchers/templates/Template1'), {
  ssr: false,
})
const Template2 = dynamic(() => import('@/pages/dashboard/vouchers/templates/Template2'), {
  ssr: false,
})
const Template3 = dynamic(() => import('@/pages/dashboard/vouchers/templates/Template3'), {
  ssr: false,
})
const Template4 = dynamic(() => import('@/pages/dashboard/vouchers/templates/Template4'), {
  ssr: false,
})
const Template5 = dynamic(() => import('@/pages/dashboard/vouchers/templates/Template5'), {
  ssr: false,
})

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

const VoucherForm: React.FC<VoucherFormProps> = ({
  initialValues,
  onSubmit,
  loading
}) => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(initialValues?.storeId)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template1')
  
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
    const store = stores.find((s: Store) => s._id === value || s.id === value)
    setSelectedStore(store || null)
    form.setFieldsValue({ productId: undefined, amount: undefined })
    setSelectedProduct(null)
  }
  
  // Handle product selection change
  const handleProductChange = (value: string) => {
    const product = products.find((p: Product) => p._id === value || p.id === value)
    setSelectedProduct(product || null)
    
    if (product) {
      // Set the amount based on the product price
      form.setFieldsValue({ amount: product.price })
    } else {
      form.setFieldsValue({ amount: undefined })
    }
  }

  // Handle template change
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value)
  }

  // Set form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      console.log("Original initialValues:", initialValues);
      setSelectedStoreId(initialValues.storeId);
      
      try {
        // Find the store to set it as selected
        if (initialValues.storeId && stores.length > 0) {
          const store = stores.find(
            (s: Store) => s._id === initialValues.storeId || s.id === initialValues.storeId
          )
          setSelectedStore(store || null)
        }
        
        // Find the product to set it as selected
        if (initialValues.productId && products.length > 0) {
          const product = products.find(
            (p: Product) => p._id === initialValues.productId || p.id === initialValues.productId
          )
          setSelectedProduct(product || null)
        }
        
        // Create a new object with values properly formatted for the form
        const formattedValues = {
          ...initialValues,
          // Ensure date is in correct format for HTML date input (YYYY-MM-DD)
          expirationDate: initialValues.expirationDate ? 
            formatDateString(new Date(initialValues.expirationDate)) : 
            getThreeMonthsFromNow()
        };
        
        console.log("Formatted values for form:", formattedValues);
        form.setFieldsValue(formattedValues);
        
        if (initialValues.template) {
          setSelectedTemplate(initialValues.template)
        }
      } catch (error) {
        console.error("Error setting form values:", error);
      }
    } else {
      // For new vouchers, set default expiration date to 3 months from now
      form.setFieldsValue({ 
        expirationDate: getThreeMonthsFromNow() 
      });
    }
  }, [initialValues, form, products, stores]);

  const handleFinish = (values: any) => {
    console.log("Form values on submit:", values);
    
    // All values are already in the correct format
    const formattedValues: VoucherFormData = {
      ...values,
      // Ensure the date is in the format expected by the API
      expirationDate: values.expirationDate ? formatDateString(new Date(values.expirationDate)) : undefined,
      // Include store information
      store: selectedStore ? {
        name: selectedStore.name,
        email: selectedStore.email,
        phone: selectedStore.phone,
        address: selectedStore.address,
        logo: selectedStore.logo,
        social: selectedStore.social
      } : undefined
    };
    
    console.log("Formatted values for submission:", formattedValues);
    onSubmit(formattedValues);
  };

  const handleCancel = () => {
    router.push('/dashboard/vouchers')
  }

  // Prepare template preview props
  const getTemplateProps = () => {
    const formValues = form.getFieldsValue()
    return {
      senderName: formValues.senderName || '',
      senderEmail: formValues.senderEmail || '',
      receiverName: formValues.receiverName || '',
      receiverEmail: formValues.receiverEmail || '',
      message: formValues.message || '',
      productName: selectedProduct?.name || '',
      storeName: selectedStore?.name || '',
      storeAddress: selectedStore?.address || '',
      storeEmail: selectedStore?.email || '',
      storePhone: selectedStore?.phone || '',
      storeSocial: selectedStore?.social || {},
      storeLogo: selectedStore?.logo || '',
      expirationDate: formValues.expirationDate || getThreeMonthsFromNow(),
      code: formValues.code || '',
      qrCode: ''
    }
  }

  // Render selected template preview
  const renderTemplatePreview = () => {
    const props = getTemplateProps()
    
    switch (selectedTemplate) {
      case 'template1':
        return <Template1 {...props} />
      case 'template2':
        return <Template2 {...props} />
      case 'template3':
        return <Template3 {...props} />
      case 'template4':
        return <Template4 {...props} />
      case 'template5':
        return <Template5 {...props} />
      default:
        return <Template1 {...props} />
    }
  }

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          template: 'template1',
          expirationDate: getThreeMonthsFromNow(),
          ...initialValues
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Store & Product Information">
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
                  onChange={handleProductChange}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>

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
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Voucher Details">
              <Form.Item
                name="senderName"
                label="Sender Name"
                rules={[{ required: true, message: 'Please enter sender name' }]}
              >
                <Input placeholder="Enter sender name" />
              </Form.Item>

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

              <Form.Item
                name="receiverName"
                label="Receiver Name"
                rules={[{ required: true, message: 'Please enter receiver name' }]}
              >
                <Input placeholder="Enter receiver name" />
              </Form.Item>

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
            </Card>
          </Col>
        </Row>

        <Card title="Message & Template" style={{ marginTop: '16px' }}>
          <Row gutter={16}>
            <Col span={12}>
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

            <Col span={12}>
              <Form.Item
                name="expirationDate"
                label="Expiration Date"
                rules={[
                  { required: true, message: 'Please select an expiration date' },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject('Please select an expiration date');
                      }
                      if (!isDateInFuture(value)) {
                        return Promise.reject('Expiration date must be in the future');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input 
                  type="date"
                  style={{ width: '100%' }} 
                  min={getTomorrowDateString()}
                  max={getSixMonthsFromNow()}
                  defaultValue={getThreeMonthsFromNow()}
                />
              </Form.Item>

              <Form.Item
                name="template"
                label="Template"
                rules={[{ required: true, message: 'Please select a template' }]}
              >
                <Select
                  placeholder="Select a template"
                  options={TEMPLATE_OPTIONS}
                  onChange={handleTemplateChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Template Preview" style={{ marginTop: '16px' }}>
          {renderTemplatePreview()}
        </Card>

        <Form.Item style={{ marginTop: '16px' }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {initialValues ? 'Update Voucher' : 'Create Voucher'}
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default VoucherForm 