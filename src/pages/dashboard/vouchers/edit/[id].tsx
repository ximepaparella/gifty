import React, { useEffect, useCallback, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Card, Spin, Tabs, Button, Descriptions, Typography, Row, Col, Space, Tag, Tooltip, message } from 'antd'
import { EditOutlined, EyeOutlined, MailOutlined, PrinterOutlined, LinkOutlined } from '@ant-design/icons'
import DashboardLayout from '@/layouts/DashboardLayout'
import VoucherForm from '@/features/vouchers/components/VoucherForm'
import { useVouchers } from '@/features/vouchers/hooks/useVouchers'
import Template1 from '../templates/Template1'
import Template2 from '../templates/Template2'
import Template3 from '../templates/Template3'
import Template4 from '../templates/Template4'
import Template5 from '../templates/Template5'

const { Title, Text } = Typography;

interface TabItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

const EditVoucherPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const { 
    selectedVoucher, 
    loading, 
    submitting, 
    fetchVoucherById, 
    handleUpdateVoucher 
  } = useVouchers()
  
  const [activeTab, setActiveTab] = useState('view');
  const baseUrl = typeof window !== 'undefined' ? 
    `${window.location.protocol}//${window.location.host}` : 
    'http://localhost:3000';

  // Use useCallback to prevent infinite dependency cycle
  const fetchVoucher = useCallback(() => {
    if (id && typeof id === 'string') {
      console.log("Fetching voucher with ID:", id);
      fetchVoucherById(id);
    }
  }, [id, fetchVoucherById]);



  const handleSubmit = (values: any) => {
    if (id && typeof id === 'string') {
      handleUpdateVoucher(id, values)
    }
  }

  const copyVoucherLink = () => {
    const voucherUrl = `${baseUrl}/vouchers/redeem?code=${selectedVoucher?.code}`;
    navigator.clipboard.writeText(voucherUrl)
      .then(() => {
        message.success('Redemption link copied to clipboard');
      })
      .catch(() => {
        message.error('Failed to copy link');
      });
  };

  const renderVoucherTemplate = () => {
    if (!selectedVoucher) return null;

    // Get store and product info based on their IDs
    // In a real app, you would fetch these from the API
    const getStoreName = (storeId: string) => {
      // This would be replaced with a proper lookup
      return 'Store Name';
    };

    const getProductName = (productId: string) => {
      // This would be replaced with a proper lookup
      return 'Product Name';
    };

    const templateProps = {
      senderName: selectedVoucher.senderName || '',
      senderEmail: selectedVoucher.senderEmail || '',
      receiverName: selectedVoucher.receiverName || '',
      receiverEmail: selectedVoucher.receiverEmail || '',
      message: selectedVoucher.message || '',
      code: selectedVoucher.code || '',
      productName: getProductName(selectedVoucher.productId),
      storeName: getStoreName(selectedVoucher.storeId),
      storeAddress: '123 Store Address, City',
      storeEmail: 'store@example.com',
      storePhone: '+1 (123) 456-7890',
      storeSocial: '@storename',
      storeLogo: 'https://placehold.co/150x150/png',
      expirationDate: selectedVoucher.expirationDate 
        ? new Date(selectedVoucher.expirationDate).toLocaleDateString() 
        : 'No expiration',
      qrCode: selectedVoucher.qrCode || ''
    };

    const templateType = selectedVoucher.template?.toLowerCase() || 'template1';
    
    switch (templateType) {
      case 'template1':
        return <Template1 {...templateProps} />;
      case 'template2':
        return <Template2 {...templateProps} />;
      case 'template3':
        return <Template3 {...templateProps} />;
      case 'template4':
        return <Template4 {...templateProps} />;
      case 'template5':
        return <Template5 {...templateProps} />;
      default:
        return <Template1 {...templateProps} />;
    }
  };

  const getStatusTag = () => {
    if (!selectedVoucher) return null;
    
    if (selectedVoucher.status === 'redeemed' || selectedVoucher.isRedeemed) {
      return <Tag color="success">Redeemed</Tag>;
    } else if (selectedVoucher.status === 'expired' || 
              (selectedVoucher.expirationDate && new Date(selectedVoucher.expirationDate) < new Date())) {
      return <Tag color="error">Expired</Tag>;
    } else {
      return <Tag color="processing">Active</Tag>;
    }
  };

  // Generate tabs
  const items: TabItem[] = [
    {
      key: 'view',
      label: <span><EyeOutlined /> View Voucher</span>,
      children: (
        <div>
          {selectedVoucher && (
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card>
                  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {renderVoucherTemplate()}
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Card title="Voucher Details">
                    <Descriptions column={1}>
                      <Descriptions.Item label="Status">{getStatusTag()}</Descriptions.Item>
                      <Descriptions.Item label="Code">{selectedVoucher.code}</Descriptions.Item>
                      <Descriptions.Item label="Amount">${selectedVoucher.amount}</Descriptions.Item>
                      <Descriptions.Item label="Expiration Date">
                        {selectedVoucher.expirationDate 
                          ? new Date(selectedVoucher.expirationDate).toLocaleDateString() 
                          : 'No expiration'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Created At">
                        {selectedVoucher.createdAt 
                          ? new Date(selectedVoucher.createdAt).toLocaleString() 
                          : 'Unknown'}
                      </Descriptions.Item>
                      {selectedVoucher.isRedeemed && (
                        <Descriptions.Item label="Redeemed At">
                          {selectedVoucher.redeemedAt 
                            ? new Date(selectedVoucher.redeemedAt).toLocaleString() 
                            : 'Unknown'}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </Card>
                  
                  <Card title="QR Code">
                    <div style={{ textAlign: 'center' }}>
                      {selectedVoucher.qrCode ? (
                        <img 
                          src={selectedVoucher.qrCode} 
                          alt={`QR Code for voucher ${selectedVoucher.code}`}
                          style={{ width: 150, height: 150 }}
                        />
                      ) : (
                        <div style={{ width: 150, height: 150, margin: '0 auto', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          border: '1px dashed #d9d9d9' }}>
                          No QR Code Available
                        </div>
                      )}
                      <div style={{ marginTop: '15px' }}>
                        <Space>
                          <Button 
                            icon={<LinkOutlined />} 
                            onClick={copyVoucherLink}
                          >
                            Copy Link
                          </Button>
                          <Tooltip title="Send via Email" placement="top">
                            <Button icon={<MailOutlined />} />
                          </Tooltip>
                          <Tooltip title="Print Voucher" placement="top">
                            <Button icon={<PrinterOutlined />} />
                          </Tooltip>
                        </Space>
                      </div>
                    </div>
                  </Card>
                </Space>
              </Col>
            </Row>
          )}
        </div>
      ),
    },
    {
      key: 'edit',
      label: <span><EditOutlined /> Edit Voucher</span>,
      children: (
        <div>
          {selectedVoucher ? (
            <VoucherForm
              initialValues={selectedVoucher}
              onSubmit={handleSubmit}
              loading={submitting}
            />
          ) : (
            <div>No voucher found with ID: {id}</div>
          )}
        </div>
      ),
    },
  ];

  console.log("Edit page - Voucher ID:", id);
  console.log("Edit page - Selected voucher:", selectedVoucher);
  console.log("Edit page - Loading state:", loading);

  if (loading) {
    return (
      <DashboardLayout title="Voucher Details">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" tip="Loading voucher..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Voucher Details | Gifty Dashboard</title>
      </Head>
      <DashboardLayout title="Voucher Details">
        <Card>
          <Tabs 
            defaultActiveKey="view"
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
          />
        </Card>
      </DashboardLayout>
    </>
  )
}

export default EditVoucherPage 