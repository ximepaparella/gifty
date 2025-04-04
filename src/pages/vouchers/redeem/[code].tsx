import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Layout, Spin, Result, Button } from 'antd';
import { useVouchers } from '@/features/vouchers/hooks/useVouchers';
import VoucherRedemption from '@/features/vouchers/components/VoucherRedemption';

const { Content } = Layout;

const VoucherRedeemPage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [redeemError, setRedeemError] = useState<string>();
  
  console.log('Page render - URL code:', code);
  
  const { 
    currentVoucher, 
    loading, 
    error, 
    getVoucherByCode, 
    redeemVoucher,
    submitting 
  } = useVouchers();

  // Extract the actual voucher data from the response
  const voucherData = currentVoucher?.voucher;
  
  console.log('Current voucher data:', {
    hasVoucher: !!voucherData,
    voucherData,
    loading,
    error,
    submitting
  });

  useEffect(() => {
    const fetchVoucher = async () => {
      if (!code || typeof code !== 'string') {
        console.log('No valid code available yet:', code);
        return;
      }
      
      console.log('Fetching voucher with code:', code);
      try {
        const voucher = await getVoucherByCode(code);
        console.log('Fetched voucher:', voucher);
      } catch (err) {
        console.error('Error fetching voucher:', err);
      }
    };

    if (router.isReady) {
      console.log('Router is ready, fetching voucher...');
      fetchVoucher();
    } else {
      console.log('Router not ready yet');
    }
  }, [code, router.isReady, getVoucherByCode]);

  const handleRedeem = async () => {
    console.log('Redeem button clicked, current voucher:', voucherData);
    
    if (!voucherData?.code) {
      console.error('Cannot redeem: No voucher code available');
      return;
    }
    
    try {
      setRedeemError(undefined);
      console.log('Attempting to redeem voucher with code:', voucherData.code);
      
      const success = await redeemVoucher(voucherData.code);
      console.log('Redeem result:', success);
      
      if (success) {
        setRedeemSuccess(true);
        console.log('Redemption successful, refreshing voucher data...');
        await getVoucherByCode(voucherData.code);
      }
    } catch (error) {
      console.error('Error during redemption:', error);
      if (error instanceof Error) {
        setRedeemError(error.message);
      } else {
        setRedeemError('An unexpected error occurred');
      }
    }
  };

  if (loading) {
    console.log('Showing loading state');
    return (
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Head>
          <title>Loading Voucher | Gift Voucher Platform</title>
        </Head>
        <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error || !voucherData) {
    console.log('Showing error state:', { error, hasVoucher: !!voucherData });
    return (
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Head>
          <title>Voucher Not Found | Gift Voucher Platform</title>
        </Head>
        <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Result
            status="error"
            title="Voucher Not Found"
            subTitle="The voucher you are looking for could not be found or has expired."
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

  console.log('Rendering voucher redemption component with data:', voucherData);
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Head>
        <title>Redeem Voucher | Gift Voucher Platform</title>
        <meta name="description" content="Redeem your gift voucher" />
      </Head>
      
      <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: 800, width: '100%' }}>
          <VoucherRedemption
            voucher={voucherData}
            onRedeem={handleRedeem}
            isRedeeming={submitting}
            redeemSuccess={redeemSuccess}
            error={redeemError}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default VoucherRedeemPage; 