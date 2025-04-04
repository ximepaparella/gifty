import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Select, DatePicker, Card, Divider, Space, Typography, Tag, QRCode, Modal, message } from 'antd';
import { OrderFormData, Order } from '../types';
import dayjs from '@/utils/dayjs';
import { useStores } from '@/features/stores/hooks/useStores';
import { useUsers } from '@/features/users/hooks/useUsers';
import { getProductsByStoreId } from '@/features/product/services/productService';
import { Product } from '@/features/product/types';
import OrderPreview from './OrderPreview';
import { PlusOutlined, CopyOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface OrderFormProps {
  initialValues?: Order;
  onSubmit: (values: OrderFormData) => void;
  loading?: boolean;
}

const { Option } = Select;
const { Text } = Typography;

// Helper function to get date 60 days from now
const getSixtyDaysFromNow = (): dayjs.Dayjs => {
  return dayjs().add(60, 'day');
};

const OrderForm: React.FC<OrderFormProps> = ({ initialValues, onSubmit, loading = false }) => {
  const [form] = Form.useForm();
  const [previewData, setPreviewData] = useState<OrderFormData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialValues?.voucher?.template || 'Template1');
  const [selectedStore, setSelectedStore] = useState<string | undefined>(initialValues?.voucher?.storeId);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string>(initialValues?.voucher?.code || '');
  const [redeemLink, setRedeemLink] = useState<string>('');
  const [isCreateCustomerModalVisible, setIsCreateCustomerModalVisible] = useState(false);
  const [customerForm] = Form.useForm();
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string, name: string, email: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { stores, loading: storesLoading } = useStores();
  const { users, loading: usersLoading, handleCreateUser } = useUsers();

  // Filter users to only show customers
  const customerUsers = users?.filter(user => user.role === 'customer' || !user.role);

  // Find customer by ID for display purposes
  useEffect(() => {
    if (initialValues?.customerId && customerUsers?.length) {
      const customer = customerUsers.find(user => 
        user.id === initialValues.customerId
      );
      if (customer) {
        setSelectedCustomer({
          id: customer.id,
          name: customer.name || '',
          email: customer.email
        });
      }
    }
  }, [initialValues?.customerId, customerUsers]);

  // Generate a random password when customer modal opens
  useEffect(() => {
    if (isCreateCustomerModalVisible) {
      const randomPassword = Math.random().toString(36).slice(-10);
      setGeneratedPassword(randomPassword);
      customerForm.setFieldsValue({ password: randomPassword });
    }
  }, [isCreateCustomerModalVisible, customerForm]);

  // Load products for selected store from API
  useEffect(() => {
    if (selectedStore) {
      setProductsLoading(true);
      getProductsByStoreId(selectedStore)
        .then(data => {
          console.log('Products fetched:', data);
          setProducts(data);
          setProductsLoading(false);
          
          // If we're editing and have a product ID, update the amount and selected product
          if (initialValues?.voucher?.productId) {
            const foundProduct = data.find(p => 
              (p.id && p.id === initialValues.voucher.productId) || 
              (p._id && p._id === initialValues.voucher.productId)
            );
            
            if (foundProduct) {
              console.log('Editing: Found product for amount:', foundProduct);
              setSelectedProduct(foundProduct);
              
              // Only set amount if it's not already defined in initialValues
              if (!initialValues.paymentDetails.amount) {
                form.setFieldsValue({
                  paymentDetails: {
                    ...form.getFieldValue('paymentDetails'),
                    amount: foundProduct.price
                  }
                });
              }
            }
          }
        })
        .catch(error => {
          console.error('Error fetching products:', error);
          setProducts([]);
          setProductsLoading(false);
          message.error('Failed to load products for this store');
        });
    } else {
      setProducts([]);
      setSelectedProduct(null);
    }
  }, [selectedStore]);

  // Set expiration date to 60 days from now when form is initialized
  useEffect(() => {
    // Set default expiration date to 60 days from now if not editing
    if (!initialValues) {
      const sixtyDaysFromNow = getSixtyDaysFromNow();
      form.setFieldsValue({
        voucher: {
          ...form.getFieldValue('voucher'),
          expirationDate: sixtyDaysFromNow
        }
      });
    }
  }, [form, initialValues]);

  // When product is selected, set the amount based on product price
  const handleProductChange = (productId: string) => {
    console.log('Product selected:', productId);
    const foundProduct = products.find(p => 
      (p.id && p.id === productId) || (p._id && p._id === productId)
    );
    
    if (foundProduct) {
      console.log('Selected product:', foundProduct);
      setSelectedProduct(foundProduct);
      form.setFieldsValue({
        paymentDetails: {
          ...form.getFieldValue('paymentDetails'),
          amount: foundProduct.price
        }
      });
    } else {
      console.warn('Product not found for ID:', productId);
      setSelectedProduct(null);
    }
  };

  // Generate redemption link based on environment and voucher code
  const generateRedemptionLink = (code: string): string => {
    // This should be configured based on your environment to point to the public-facing app
    // not the admin dashboard
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    
    // The path should match the VoucherRedeemPage shown in the example
    return `${baseUrl}/vouchers/redeem/${code}`;
  };

  // Generate a random voucher code that can be used for new orders
  const generateRandomCode = (): string => {
    // Generate a random alphanumeric code (8 characters)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Generate voucher code when needed
  useEffect(() => {
    // Only generate a new code for new orders (not editing) and when no code is set
    if (!initialValues && !voucherCode) {
      const generatedCode = generateRandomCode();
      console.log('Generated new voucher code:', generatedCode);
      setVoucherCode(generatedCode);
      
      // Also set it in the form
      form.setFieldsValue({
        voucher: {
          ...form.getFieldValue('voucher'),
          code: generatedCode
        }
      });
      
      // Set the redemption link based on the new code
      setRedeemLink(generateRedemptionLink(generatedCode));
    }
  }, [initialValues, form, voucherCode]);

  // Generate redemption link and QR code whenever voucher code changes
  useEffect(() => {
    if (voucherCode) {
      const link = generateRedemptionLink(voucherCode);
      setRedeemLink(link);
      console.log('Redemption link set to:', link);
    }
  }, [voucherCode]);

  // Every time form values change, update the preview
  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    try {
      console.log('Form values changed:', changedValues);
      console.log('All form values:', allValues);
      
      // Set preview data with all current form values
      setPreviewData(allValues as OrderFormData);
      
      // Update selected template if changed
      if (changedValues.voucher?.template && changedValues.voucher.template !== selectedTemplate) {
        console.log('Template changed to:', changedValues.voucher.template);
        // Ensure template is in correct format (first letter uppercase, rest lowercase)
        const formattedTemplate = changedValues.voucher.template.charAt(0).toUpperCase() + 
          changedValues.voucher.template.slice(1).toLowerCase();
        
        setSelectedTemplate(formattedTemplate);
        
        // Also update the form value to maintain consistency
        form.setFieldsValue({
          voucher: {
            ...form.getFieldValue('voucher'),
            template: formattedTemplate
          }
        });
      }

      // Update selected store if changed
      if (changedValues.voucher?.storeId && changedValues.voucher.storeId !== selectedStore) {
        setSelectedStore(changedValues.voucher.storeId);
        // Clear product selection when store changes
        form.setFieldsValue({ 
          voucher: { ...form.getFieldValue('voucher'), productId: undefined },
          paymentDetails: { ...form.getFieldValue('paymentDetails'), amount: undefined }
        });
      }

      // Update amount if product changed
      if (changedValues.voucher?.productId) {
        handleProductChange(changedValues.voucher.productId);
      }

      // Update selected customer if changed
      if (changedValues.customerId && customerUsers?.length) {
        const customer = customerUsers.find(user => 
          user.id === changedValues.customerId
        );
        
        if (customer) {
          setSelectedCustomer({
            id: customer.id,
            name: customer.name || '',
            email: customer.email
          });
        }
      }

      // Update voucher code if changed
      if (changedValues.voucher?.code) {
        console.log('Voucher code changed to:', changedValues.voucher.code);
        setVoucherCode(changedValues.voucher.code);
      }
    } catch (error) {
      console.error('Error updating preview:', error);
    }
  };

  // Normalize the template name for consistent handling
  const normalizeTemplateName = (template: string): string => {
    if (!template) return 'Template1';
    
    // Handle case variations like 'template1', 'Template1', 'TEMPLATE1'
    // Convert to format 'Template1'
    const templateNumber = template.replace(/\D/g, '');
    return `Template${templateNumber}`;
  };

  // Initialize form with initialValues if provided
  useEffect(() => {
    // Initialize form with initialValues if provided
    if (initialValues) {
      console.log('Initializing form with values:', initialValues);
      
      // Make sure voucher data is correctly structured
      const voucher = initialValues.voucher || {};
      const paymentDetails = initialValues.paymentDetails || {};
      
      // Normalize the template name
      const normalizedTemplate = normalizeTemplateName(voucher.template || 'Template1');
      
      const formValues = {
        customerId: initialValues.customerId,
        paymentDetails: {
          paymentId: paymentDetails.paymentId || '',
          paymentStatus: paymentDetails.paymentStatus || 'pending',
          provider: paymentDetails.provider || 'stripe',
          amount: paymentDetails.amount || 0,
          paymentEmail: paymentDetails.paymentEmail || '',
        },
        voucher: {
          storeId: voucher.storeId || '',
          productId: voucher.productId || '',
          expirationDate: voucher.expirationDate ? dayjs(voucher.expirationDate) : getSixtyDaysFromNow(),
          senderName: voucher.senderName || '',
          senderEmail: voucher.senderEmail || '',
          receiverName: voucher.receiverName || '',
          receiverEmail: voucher.receiverEmail || '',
          message: voucher.message || '',
          template: normalizedTemplate
        }
      };
      
      console.log('Setting form values:', formValues);
      form.setFieldsValue(formValues);
      
      // Important: set preview data explicitly to ensure it's updated
      setPreviewData(formValues as unknown as OrderFormData);
      
      // Update UI state variables
      setSelectedTemplate(normalizedTemplate);
      setSelectedStore(voucher.storeId);
      
      // Update voucher code state if available in edit mode
      if (voucher.code) {
        console.log('Setting voucher code to:', voucher.code);
        setVoucherCode(voucher.code);
      }
      
      // Generate redemption link for the voucher code
      if (voucher.code) {
        const link = generateRedemptionLink(voucher.code);
        console.log('Setting redemption link to:', link);
        setRedeemLink(link);
      }
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    console.log('Form values:', values);
    
    // Format the order data for submission
    const orderData: OrderFormData = {
      customer: {
        id: values.customer
      },
      payment: {
        paymentId: values.paymentId,
        status: values.status,
        provider: values.provider,
        amount: parseFloat(values.amount),
        email: values.paymentEmail
      },
      voucher: {
        storeId: values.store,
        productId: values.product,
        expirationDate: values.expirationDate ? dayjs(values.expirationDate).format('YYYY-MM-DD') : '',
        senderName: values.senderName,
        senderEmail: values.senderEmail,
        receiverName: values.receiverName,
        receiverEmail: values.receiverEmail,
        message: values.message,
        template: values.template,
        code: initialValues?.voucher?.code || voucherCode // Use existing code for updates
      }
    };

    console.log('Formatted order data:', orderData);
    
    // Call the provided onSubmit function with the formatted data
    onSubmit(orderData);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(redeemLink)
      .then(() => {
        message.success('Redemption link copied to clipboard');
      })
      .catch(() => {
        message.error('Failed to copy link');
      });
  };

  const showCreateCustomerModal = () => {
    setIsCreateCustomerModalVisible(true);
  };

  const handleCreateCustomerCancel = () => {
    setIsCreateCustomerModalVisible(false);
    customerForm.resetFields();
  };

  const handleCreateCustomerSubmit = async () => {
    try {
      const values = await customerForm.validateFields();
      // Add role as customer
      values.role = 'customer';
      await handleCreateUser(values);
      message.success('Customer created successfully');
      setIsCreateCustomerModalVisible(false);
      customerForm.resetFields();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const templates = [
    { value: 'Template1', label: 'Template 1' },
    { value: 'Template2', label: 'Template 2' },
    { value: 'Template3', label: 'Template 3' },
    { value: 'Template4', label: 'Template 4' },
    { value: 'Template5', label: 'Template 5' },
  ];

  return (
    <Row gutter={24}>
      <Col xs={24} md={14}>
        <Card title="Order Information">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            onValuesChange={handleFormValuesChange}
            initialValues={{
              paymentDetails: {
                paymentStatus: 'pending',
                provider: 'stripe',
              },
            }}
          >
            {/* Customer Section */}
            <Form.Item
              label="Customer"
              name="customerId"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select 
                placeholder="Select a customer"
                loading={usersLoading}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={customerUsers?.map(user => ({
                  value: user.id,
                  label: `${user.name || ''} (${user.email})`,
                }))}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Button 
                      type="link" 
                      icon={<PlusOutlined />}
                      onClick={showCreateCustomerModal}
                      style={{ width: '100%', textAlign: 'left' }}
                    >
                      Create New Customer
                    </Button>
                  </>
                )}
              />
            </Form.Item>

            {/* Payment Details Section */}
            <Divider orientation="left">Payment Details</Divider>
            
            <Form.Item
              label="Payment ID"
              name={['paymentDetails', 'paymentId']}
              rules={[{ required: true, message: 'Please enter the payment ID' }]}
            >
              <Input placeholder="Payment ID" />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Status"
                  name={['paymentDetails', 'paymentStatus']}
                  rules={[{ required: true, message: 'Please select payment status' }]}
                >
                  <Select>
                    <Option value="pending">Pending</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="failed">Failed</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Provider"
                  name={['paymentDetails', 'provider']}
                  rules={[{ required: true, message: 'Please select a provider' }]}
                >
                  <Select>
                    <Option value="stripe">Stripe</Option>
                    <Option value="paypal">PayPal</Option>
                    <Option value="mercadopago">MercadoPago</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Amount"
                  name={['paymentDetails', 'amount']}
                  rules={[{ required: true, message: 'Please select a product to set the amount' }]}
                >
                  <Input 
                    prefix="$" 
                    placeholder="0.00"
                    type="number"
                    min={0}
                    step={0.01}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Payment Email"
                  name={['paymentDetails', 'paymentEmail']}
                  rules={[
                    { required: true, message: 'Please enter the payment email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="Email used for payment" />
                </Form.Item>
              </Col>
            </Row>

            {/* Voucher Details Section */}
            <Divider orientation="left">Voucher Details</Divider>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Store"
                  name={['voucher', 'storeId']}
                  rules={[{ required: true, message: 'Please select a store' }]}
                >
                  <Select 
                    placeholder="Select a store"
                    loading={storesLoading}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={stores?.map(store => ({
                      value: store.id || store._id,
                      label: store.name,
                    }))}
                    onChange={(value) => setSelectedStore(value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Product"
                  name={['voucher', 'productId']}
                  rules={[{ required: true, message: 'Please select a product' }]}
                >
                  <Select 
                    placeholder={selectedStore ? "Select a product" : "Please select a store first"}
                    disabled={!selectedStore}
                    loading={productsLoading}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={products?.map(product => ({
                      value: product.id || product._id,
                      label: `${product.name} ($${product.price})`,
                    }))}
                    onChange={handleProductChange}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        {selectedStore && (
                          <>
                            <Divider style={{ margin: '8px 0' }} />
                            <Link href={`/dashboard/products/create?storeId=${selectedStore}`}>
                              <Button 
                                type="link" 
                                icon={<PlusOutlined />}
                                style={{ width: '100%', textAlign: 'left' }}
                              >
                                Create New Product
                              </Button>
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              label="Expiration Date"
              name={['voucher', 'expirationDate']}
              rules={[{ required: true, message: 'Please select an expiration date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
            
            <Divider orientation="left">Sender Information</Divider>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Sender Name"
                  name={['voucher', 'senderName']}
                  rules={[{ required: true, message: 'Please enter the sender name' }]}
                >
                  <Input placeholder="Name of the person sending the gift" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Sender Email"
                  name={['voucher', 'senderEmail']}
                  rules={[
                    { required: true, message: 'Please enter the sender email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="Email of the sender" />
                </Form.Item>
              </Col>
            </Row>
            
            <Divider orientation="left">Receiver Information</Divider>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Receiver Name"
                  name={['voucher', 'receiverName']}
                  rules={[{ required: true, message: 'Please enter the receiver name' }]}
                >
                  <Input placeholder="Name of the person receiving the gift" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Receiver Email"
                  name={['voucher', 'receiverEmail']}
                  rules={[
                    { required: true, message: 'Please enter the receiver email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="Email of the receiver" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              label="Message"
              name={['voucher', 'message']}
              rules={[{ required: true, message: 'Please enter a message' }]}
            >
              <Input.TextArea 
                placeholder="Personal message to accompany the gift"
                rows={4}
                maxLength={200}
                showCount
              />
            </Form.Item>
            
            <Form.Item
              label="Template"
              name={['voucher', 'template']}
              rules={[{ required: true, message: 'Please select a template' }]}
            >
              <Select 
                options={templates}
                onChange={(value) => {
                  const normalizedTemplate = normalizeTemplateName(value);
                  setSelectedTemplate(normalizedTemplate);
                }}
              />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {initialValues ? 'Update Order' : 'Create Order'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      
      <Col xs={24} md={10}>
        <Card title="Preview" style={{ position: 'sticky', top: 20, marginBottom: '20px' }}>
          {previewData ? (
            <OrderPreview 
              data={previewData} 
              template={selectedTemplate}
              voucherCode={voucherCode}
              productInfo={selectedProduct}
              storeInfo={stores?.find(s => s.id === selectedStore || s._id === selectedStore)}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              Fill in the form to see a preview
            </div>
          )}
        </Card>

        {/* Redemption Information Card */}
        <Card title="Redemption Information" style={{ position: 'sticky', top: 380 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* QR Code */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              {initialValues?.voucher?.qrCode ? (
                // If we have a QR code URL from the API, display it as an image
                <img 
                  src={initialValues.voucher.qrCode} 
                  alt="Voucher QR Code" 
                  style={{ width: 200, height: 200 }}
                />
              ) : redeemLink ? (
                // Otherwise generate a QR code based on the redemption link
                <QRCode
                  value={redeemLink}
                  size={200}
                  bordered={false}
                />
              ) : (
                // Loading state when no data is available
                <QRCode
                  value="https://example.com/placeholder"
                  size={200}
                  bordered={false}
                  status="loading"
                />
              )}
            </div>

            {/* Voucher Code */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Tag color="blue" style={{ fontSize: '16px', padding: '5px 10px' }}>
                {voucherCode || 'CODE12345'}
              </Tag>
            </div>

            {/* Redemption Link */}
            <div>
              <Text strong>Redemption Link:</Text>
              <div style={{ display: 'flex', marginTop: '5px' }}>
                <Input 
                  value={redeemLink || 'Loading...'}
                  disabled 
                  style={{ flex: 1 }}
                />
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={handleCopyLink}
                  disabled={!redeemLink}
                >
                  Copy
                </Button>
              </div>
              <Text type="secondary" style={{ display: 'block', marginTop: '5px' }}>
                The QR code contains this link. Share it or let customers scan the QR code to redeem the voucher.
              </Text>
            </div>

            {/* Redeem Button */}
            {redeemLink && (
              <Button 
                type="primary" 
                block 
                style={{ marginTop: '20px' }}
                onClick={() => window.open(redeemLink, '_blank')}
              >
                Redeem Voucher
              </Button>
            )}
          </Space>
        </Card>
      </Col>

      {/* Create Customer Modal */}
      <Modal
        title="Create New Customer"
        open={isCreateCustomerModalVisible}
        onOk={handleCreateCustomerSubmit}
        onCancel={handleCreateCustomerCancel}
        okText="Create"
        confirmLoading={loading}
      >
        <Form
          form={customerForm}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter customer name' }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter customer email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Email Address" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            tooltip="This is an auto-generated password that the customer can change later"
          >
            <Input.Password 
              prefix={<LockOutlined />}
              disabled
              value={generatedPassword}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default OrderForm; 