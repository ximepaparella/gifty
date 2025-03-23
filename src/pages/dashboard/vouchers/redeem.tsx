import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, Card, Spin, Divider, Typography, Row, Col, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, GiftOutlined } from '@ant-design/icons';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useVouchers } from '@/features/vouchers/hooks/useVouchers';
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';
import Template4 from './templates/Template4';
import Template5 from './templates/Template5';

const { Title, Text } = Typography;

const VoucherRedemptionPage = () => {
  const router = useRouter();
  const [voucherCode, setVoucherCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  
  const { 
    currentVoucher, 
    loading, 
    error,
    getVoucherByCode, 
    redeemVoucher, 
    submitting
  } = useVouchers();

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

    setIsSearching(true);
    try {
      await getVoucherByCode(code);
      setIsSearching(false);
    } catch (error) {
      setIsSearching(false);
    }
  };

  const handleRedeem = async () => {
    if (!currentVoucher) return;
    
    try {
      const success = await redeemVoucher(currentVoucher.code);
      if (success) {
        setRedeemed(true);
      }
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const renderVoucherTemplate = () => {
    if (!currentVoucher) return null;

    const templateProps = {
      recipientName: currentVoucher.recipientName || '',
      message: currentVoucher.message || '',
      senderName: currentVoucher.senderName || '',
      senderEmail: currentVoucher.senderEmail || '',
      receiverName: currentVoucher.recipientName || '',
      receiverEmail: currentVoucher.recipientEmail || '',
      amount: currentVoucher.amount || 0,
      code: currentVoucher.code || '',
      productName: currentVoucher.productName || '',
      companyName: currentVoucher.companyName || 'Our Company',
      storeName: currentVoucher.storeName || 'Our Store',
      storeAddress: currentVoucher.storeAddress || '123 Store Address, City',
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
        <title>Redeem Voucher | Gifty</title>
      </Head>
      <DashboardLayout>
        <Card>
          <Title level={2}>
            <GiftOutlined /> Voucher Redemption
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
                    loading={isSearching}
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
        </Card>
      </DashboardLayout>
    </>
  );
};

export default VoucherRedemptionPage; 