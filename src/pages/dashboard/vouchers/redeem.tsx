import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Layout, Input, Button, Space, Typography, Alert } from 'antd';
import { useVouchers } from '@/features/vouchers/hooks/useVouchers';
import VoucherRedemption from '@/features/vouchers/components/VoucherRedemption';
import DashboardLayout from '@/layouts/DashboardLayout';

const { Content } = Layout;
const { Title } = Typography;

const VoucherRedeemPage: NextPage = () => {
  const [voucherCode, setVoucherCode] = useState('');
  const [showRedemption, setShowRedemption] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [redeemError, setRedeemError] = useState<string>();
  
  console.log('Dashboard redeem page render');
  
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

  const handleSearch = async () => {
    if (!voucherCode.trim()) {
      console.log('No voucher code entered');
      return;
    }
    
    const code = voucherCode.trim();
    console.log('Searching for voucher with code:', code);
    
    try {
      setRedeemError(undefined);
      setShowRedemption(false);
      setRedeemSuccess(false);
      
      const voucher = await getVoucherByCode(code);
      console.log('Found voucher:', voucher);
      
      setShowRedemption(true);
    } catch (error) {
      console.error('Error searching for voucher:', error);
      if (error instanceof Error) {
        setRedeemError(error.message);
      } else {
        setRedeemError('An unexpected error occurred while searching for the voucher');
      }
    }
  };

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
        setRedeemError('An unexpected error occurred while redeeming the voucher');
      }
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Redeem Voucher | Dashboard</title>
        <meta name="description" content="Redeem a gift voucher" />
      </Head>
      
      <Content style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <Title level={2}>Redeem Voucher</Title>
        
        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 24 }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="Enter voucher code"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              onPressEnter={handleSearch}
              disabled={loading}
            />
            <Button 
              type="primary" 
              onClick={handleSearch}
              loading={loading}
            >
              Search
            </Button>
          </Space.Compact>

          {error && !showRedemption && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
            />
          )}

          {showRedemption && voucherData && (
            <VoucherRedemption
              voucher={voucherData}
              onRedeem={handleRedeem}
              isRedeeming={submitting}
              redeemSuccess={redeemSuccess}
              error={redeemError}
            />
          )}
        </Space>
      </Content>
    </DashboardLayout>
  );
};

export default VoucherRedeemPage; 