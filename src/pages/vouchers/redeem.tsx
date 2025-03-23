import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Card, Input, Button, Typography, Space, Divider, Row, Col, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, GiftOutlined } from '@ant-design/icons';
import Head from 'next/head';
import { getVoucherByCode, redeemVoucher } from '@/features/vouchers/services/voucherService';
import { Voucher } from '@/features/vouchers/types';
import Template1 from '../dashboard/vouchers/templates/Template1';
import Template2 from '../dashboard/vouchers/templates/Template2';
import Template3 from '../dashboard/vouchers/templates/Template3';
import Template4 from '../dashboard/vouchers/templates/Template4';
import Template5 from '../dashboard/vouchers/templates/Template5';

const { Header, Content, Footer } = Layout;
const { Title, Text, Link } = Typography;

const PublicVoucherRedemptionPage = () => {
  const router = useRouter();
  const [voucherCode, setVoucherCode] = useState('');
  const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [redeemed, setRedeemed] = useState(false);

  // Check for code in URL query
  useEffect(() => {
    if (router.query.code) {
      setVoucherCode(router.query.code as string);
      handleSearch(router.query.code as string);
    }
  }, [router.query]);

  const handleSearch = async (code: string) => {
    if (!code) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const voucher = await getVoucherByCode(code);
      setCurrentVoucher(voucher);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!currentVoucher) return;
    
    setSubmitting(true);
    try {
      const success = await redeemVoucher(currentVoucher.code);
      if (success) {
        setRedeemed(true);
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
    }
  };

  const renderVoucherTemplate = () => {
    if (!currentVoucher) return null;

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
      senderName: currentVoucher.senderName || '',
      senderEmail: currentVoucher.senderEmail || '',
      receiverName: currentVoucher.receiverName || '',
      receiverEmail: currentVoucher.receiverEmail || '',
      message: currentVoucher.message || '',
      amount: currentVoucher.amount || 0,
      code: currentVoucher.code || '',
      productName: getProductName(currentVoucher.productId),
      storeName: getStoreName(currentVoucher.storeId),
      storeAddress: '123 Store Address, City',
      storeEmail: 'store@example.com',
      storePhone: '+1 (123) 456-7890',
      storeSocial: '@storename',
      storeLogo: 'https://placehold.co/150x150/png',
      expirationDate: currentVoucher.expirationDate 
        ? new Date(currentVoucher.expirationDate).toLocaleDateString() 
        : 'No expiration',
      qrCode: currentVoucher.qrCode || ''
    };

    const templateType = currentVoucher.template?.toLowerCase() || 'template1';
    
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

  const isVoucherRedeemed = redeemed || (currentVoucher && (currentVoucher.isRedeemed || currentVoucher.status === 'redeemed'));
  const isVoucherExpired = currentVoucher && currentVoucher.expirationDate 
    ? new Date(currentVoucher.expirationDate) < new Date() 
    : false;

  return (
    <>
      <Head>
        <title>Redeem Your Voucher | Gifty</title>
        <meta name="description" content="Redeem your gift voucher" />
      </Head>

      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 50px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <GiftOutlined style={{ fontSize: 28, marginRight: 10 }} />
            <Title level={3} style={{ margin: 0 }}>Gifty</Title>
          </div>
        </Header>
        
        <Content style={{ padding: '50px' }}>
          <Card style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center' }}>
              <GiftOutlined style={{ marginRight: 10 }} /> Redeem Your Voucher
            </Title>
            <Divider />
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {!currentVoucher && (
                <Row gutter={16}>
                  <Col xs={24} sm={16}>
                    <Input
                      placeholder="Enter voucher code"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      size="large"
                      onPressEnter={() => handleSearch(voucherCode)}
                    />
                  </Col>
                  <Col xs={24} sm={8}>
                    <Button 
                      type="primary" 
                      onClick={() => handleSearch(voucherCode)} 
                      loading={loading}
                      size="large"
                      block
                    >
                      Search
                    </Button>
                  </Col>
                </Row>
              )}

              {loading && <Spin tip="Loading voucher details..." />}

              {error && !loading && (
                <Card style={{ background: '#FFF2F0', borderColor: '#FFCCC7' }}>
                  <Space>
                    <CloseCircleOutlined style={{ color: '#F5222D' }} />
                    <Text strong>Error: Voucher not found or invalid.</Text>
                  </Space>
                </Card>
              )}

              {currentVoucher && (
                <>
                  <Card 
                    style={{ 
                      background: isVoucherRedeemed ? '#F6FFED' : 
                                isVoucherExpired ? '#FFF2F0' : '#FFFFFF',
                      borderColor: isVoucherRedeemed ? '#B7EB8F' : 
                                  isVoucherExpired ? '#FFCCC7' : '#D9D9D9'
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        {isVoucherRedeemed && (
                          <div style={{ marginBottom: 16 }}>
                            <Space>
                              <CheckCircleOutlined style={{ color: '#52C41A' }} />
                              <Text strong style={{ color: '#52C41A' }}>
                                This voucher has been redeemed
                              </Text>
                            </Space>
                          </div>
                        )}
                        
                        {isVoucherExpired && (
                          <div style={{ marginBottom: 16 }}>
                            <Space>
                              <CloseCircleOutlined style={{ color: '#F5222D' }} />
                              <Text strong style={{ color: '#F5222D' }}>
                                This voucher has expired
                              </Text>
                            </Space>
                          </div>
                        )}
                        
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                          {renderVoucherTemplate()}
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  <Row justify="center">
                    <Col>
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleRedeem}
                        loading={submitting}
                        disabled={isVoucherRedeemed || isVoucherExpired}
                      >
                        {isVoucherRedeemed ? 'Already Redeemed' : 'Redeem Voucher'}
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Space>
            
            <Divider style={{ margin: '40px 0 20px' }} />
            
            <div style={{ textAlign: 'center' }}>
              <Link href="/dashboard/login">Login to dashboard</Link>
            </div>
          </Card>
        </Content>
        
        <Footer style={{ textAlign: 'center' }}>
          Gifty Platform ©{new Date().getFullYear()} - Redeem your gift vouchers online
        </Footer>
      </Layout>
    </>
  );
};

export default PublicVoucherRedemptionPage; 