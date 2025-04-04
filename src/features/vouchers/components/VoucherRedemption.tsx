import React, { useEffect } from 'react';
import { Card, Typography, Space, Button, Alert, Row, Col, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Voucher } from '../types';

const { Title, Text } = Typography;

interface VoucherRedemptionProps {
  voucher: Voucher;
  onRedeem: () => Promise<void>;
  isRedeeming: boolean;
  redeemSuccess?: boolean;
  error?: string;
}

const VoucherRedemption: React.FC<VoucherRedemptionProps> = ({
  voucher,
  onRedeem,
  isRedeeming,
  redeemSuccess,
  error
}) => {
  console.log('VoucherRedemption render with props:', {
    voucher,
    isRedeeming,
    redeemSuccess,
    hasError: !!error
  });

  useEffect(() => {
    console.log('Voucher data changed:', voucher);
  }, [voucher]);

  const isVoucherRedeemed = redeemSuccess || voucher.status === 'redeemed' || voucher.isRedeemed;
  const isVoucherExpired = voucher.expirationDate 
    ? new Date(voucher.expirationDate) < new Date() 
    : false;

  console.log('Voucher status:', {
    isRedeemed: isVoucherRedeemed,
    isExpired: isVoucherExpired,
    status: voucher.status,
    redeemSuccess
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return dateString;
    }
  };

  const handleRedeemClick = async () => {
    console.log('Redeem button clicked, current voucher state:', {
      code: voucher.code,
      status: voucher.status,
      isRedeemed: isVoucherRedeemed,
      isExpired: isVoucherExpired
    });
    await onRedeem();
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Title */}
        <Title level={2} style={{ textAlign: 'center', margin: 0 }}>
          Voucher Details
        </Title>

        {/* Status Messages */}
        {isVoucherRedeemed && (
          <Alert
            message="Voucher Successfully Redeemed"
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        )}

        {isVoucherExpired && (
          <Alert
            message="This Voucher Has Expired"
            type="error"
            showIcon
            icon={<CloseCircleOutlined />}
          />
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
          />
        )}

        {/* QR Code */}
        {voucher.qrCode && (
          <div style={{ textAlign: 'center' }}>
            <img 
              src={voucher.qrCode} 
              alt={`QR Code for voucher ${voucher.code}`}
              style={{ width: 200, height: 200 }}
            />
          </div>
        )}

        {/* Voucher Details */}
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Voucher Code">
            <Text strong copyable>{voucher.code}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Text type={isVoucherRedeemed ? "success" : isVoucherExpired ? "danger" : undefined}>
              {voucher.status?.toUpperCase() || (isVoucherRedeemed ? 'REDEEMED' : 'ACTIVE')}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Amount">
            ${voucher.amount?.toFixed(2)}
          </Descriptions.Item>
          {voucher.productId && (
            <Descriptions.Item label="Product ID">
              {voucher.productId}
            </Descriptions.Item>
          )}
          {voucher.storeId && (
            <Descriptions.Item label="Store ID">
              {voucher.storeId}
            </Descriptions.Item>
          )}
          {voucher.receiverName && (
            <Descriptions.Item label="Recipient">
              {voucher.receiverName}
              {voucher.receiverEmail && ` (${voucher.receiverEmail})`}
            </Descriptions.Item>
          )}
          {voucher.senderName && (
            <Descriptions.Item label="Sender">
              {voucher.senderName}
              {voucher.senderEmail && ` (${voucher.senderEmail})`}
            </Descriptions.Item>
          )}
          {voucher.expirationDate && (
            <Descriptions.Item label="Expiration Date">
              {formatDate(voucher.expirationDate)}
            </Descriptions.Item>
          )}
          {isVoucherRedeemed && voucher.redeemedAt && (
            <Descriptions.Item label="Redeemed At">
              {formatDateTime(voucher.redeemedAt)}
            </Descriptions.Item>
          )}
          {voucher.message && (
            <Descriptions.Item label="Message">
              {voucher.message}
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Redeem Button */}
        {!isVoucherRedeemed && !isVoucherExpired && (
          <Row justify="center">
            <Button
              type="primary"
              size="large"
              onClick={handleRedeemClick}
              loading={isRedeeming}
            >
              Redeem Voucher
            </Button>
          </Row>
        )}
      </Space>
    </Card>
  );
};

export default VoucherRedemption; 