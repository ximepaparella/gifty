import React, { useEffect, useState, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useVouchers } from '@/features/vouchers/hooks/useVouchers';
import { Layout, Card, Typography, Space, Spin, Tag, Button, Alert, Row, Col, Result } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, GiftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Content } = Layout;

interface VoucherData {
  _id: string;
  code: string;
  status: 'active' | 'redeemed' | 'expired';
  expirationDate: string;
  qrCode: string;
}

const VoucherRedeemPage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const { currentVoucher, loading, error, getVoucherByCode, redeemVoucher } = useVouchers();
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [redeemMessage, setRedeemMessage] = useState<string>('');
  const fetchAttempted = useRef(false);

  useEffect(() => {
    const fetchVoucher = async () => {
      if (!code || typeof code !== 'string') {
        return;
      }
      
      // Skip if we've already attempted to fetch this voucher
      if (fetchAttempted.current) {
        return;
      }
      
      fetchAttempted.current = true;
      
      try {
        await getVoucherByCode(code);
      } catch (err) {
        // Optionally handle error if needed in production
      }
    };

    if (router.isReady) {
      fetchVoucher();
    }
  }, [code, router.isReady, getVoucherByCode]);

  const handleRedeemVoucher = async () => {
    if (!code || typeof code !== 'string') {
      setDebugInfo(prev => `${prev}\nInvalid code for redemption: ${JSON.stringify(code)}`);
      return;
    }

    try {
      setRedeemStatus('loading');
      setRedeemMessage('');
      setDebugInfo(prev => `${prev}\nAttempting to redeem voucher with code: ${code}`);
      
      const result = await redeemVoucher(code);
      
      if (result) {
        setRedeemStatus('success');
        setRedeemMessage('Voucher has been successfully redeemed!');
        setDebugInfo(prev => `${prev}\nVoucher successfully redeemed`);
      } else {
        setRedeemStatus('error');
        setRedeemMessage('Failed to redeem voucher. It may have already been redeemed or expired.');
        setDebugInfo(prev => `${prev}\nFailed to redeem voucher`);
      }
    } catch (error: unknown) {
      console.error('Error redeeming voucher:', error);
      setRedeemStatus('error');
      // Type guard for better error handling
      if (error instanceof Error) {
        setRedeemMessage(
          error.message || 'An error occurred while redeeming the voucher'
        );
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        // Handle axios error
        const axiosError = error as { response?: { data?: { message?: string } } };
        setRedeemMessage(
          axiosError.response?.data?.message || 'An error occurred while redeeming the voucher'
        );
      } else {
        setRedeemMessage('An unexpected error occurred');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="success">{status.toUpperCase()}</Tag>;
      case 'redeemed':
        return <Tag color="processing">{status.toUpperCase()}</Tag>;
      case 'expired':
        return <Tag color="error">{status.toUpperCase()}</Tag>;
      default:
        return <Tag>{status.toUpperCase()}</Tag>;
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Head>
          <title>Redeeming Voucher | Gift Voucher Platform</title>
          <meta name="description" content="Redeem your gift voucher" />
        </Head>
        <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Space direction="vertical" align="center">
            <Spin size="large" />
            <Text type="secondary">Loading voucher information...</Text>
          </Space>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Head>
          <title>Error | Gift Voucher Platform</title>
          <meta name="description" content="Error redeeming voucher" />
        </Head>
        <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Result
            status="error"
            title="Error Loading Voucher"
            subTitle={error.toString()}
            extra={[
              <Button type="primary" key="home" onClick={() => router.push('/')}>
                Return Home
              </Button>
            ]}
          />
        </Content>
      </Layout>
    );
  }

  if (!currentVoucher) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Head>
          <title>Voucher Not Found | Gift Voucher Platform</title>
          <meta name="description" content="Voucher not found" />
        </Head>
        <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Result
            status="warning"
            title="Voucher Not Found"
            subTitle="The voucher you are looking for could not be found."
            extra={[
              <Button type="primary" key="home" onClick={() => router.push('/')}>
                Return Home
              </Button>
            ]}
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Head>
        <title>Redeem Voucher | Gift Voucher Platform</title>
        <meta name="description" content="Redeem your gift voucher" />
      </Head>
      
      <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card style={{ maxWidth: 400, width: '100%' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <img 
                src={currentVoucher.qrCode} 
                alt={`QR Code for voucher ${currentVoucher.code}`}
                style={{ width: 128, height: 128 }}
              />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Title level={3}>Voucher: {currentVoucher.code}</Title>
              {getStatusTag(currentVoucher.status)}
            </div>
            
            <div>
              <Text type="secondary">Expiration Date:</Text>
              <div>
                <Text strong>{formatDate(currentVoucher.expirationDate)}</Text>
              </div>
            </div>
            
            {currentVoucher.status === 'active' && (
              <div>
                {redeemStatus === 'idle' && (
                  <Button
                    type="primary"
                    onClick={handleRedeemVoucher}
                    block
                  >
                    Redeem This Voucher
                  </Button>
                )}
                
                {redeemStatus === 'loading' && (
                  <Button
                    type="primary"
                    loading
                    disabled
                    block
                  >
                    Processing...
                  </Button>
                )}
              </div>
            )}
            
            {redeemStatus === 'success' && (
              <Alert
                message={redeemMessage}
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
              />
            )}
            
            {redeemStatus === 'error' && (
              <Alert
                message={redeemMessage}
                type="error"
                showIcon
                icon={<CloseCircleOutlined />}
              />
            )}
            
            {currentVoucher.status === 'redeemed' && (
              <Alert
                message="This voucher has already been redeemed."
                type="info"
                showIcon
                icon={<CheckCircleOutlined />}
              />
            )}
            
            {currentVoucher.status === 'expired' && (
              <Alert
                message="This voucher has expired."
                type="error"
                showIcon
                icon={<CloseCircleOutlined />}
              />
            )}
            
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button onClick={() => router.push('/')}>
                Return Home
              </Button>
            </div>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default VoucherRedeemPage; 