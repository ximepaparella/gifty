import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Spin, Card, Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, MailOutlined } from '@ant-design/icons';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useOrders } from '@/features/order/hooks/useOrders';
import OrderPreview from '@/features/order/components/OrderPreview';
import { OrderFormData } from '@/features/order/types';

const { Title, Text } = Typography;

const PreviewOrderPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [orderId, setOrderId] = useState<string | null>(null);
  const {
    selectedOrder,
    loading,
    submitting,
    fetchOrderById,
    handleDownloadVoucherPdf,
    handleResendAllEmails,
  } = useOrders();

  // Use a local fetchData function to prevent the dependency on fetchOrderById
  // which would cause the effect to run repeatedly
  const fetchData = useCallback(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  // Set the orderId from the router query
  useEffect(() => {
    if (id && typeof id === 'string' && id !== orderId) {
      setOrderId(id);
    }
  }, [id, orderId]);

  // Fetch data when orderId changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBack = () => {
    router.back();
  };

  const handleDownload = () => {
    if (orderId) {
      handleDownloadVoucherPdf(orderId);
    }
  };

  const handleResendEmails = () => {
    if (orderId) {
      handleResendAllEmails(orderId);
    }
  };

  // Convert order to form data format for preview
  const convertToFormData = (): OrderFormData | null => {
    if (!selectedOrder) return null;

    return {
      customerId: selectedOrder.customerId,
      paymentDetails: selectedOrder.paymentDetails,
      voucher: {
        storeId: selectedOrder.voucher.storeId,
        productId: selectedOrder.voucher.productId,
        expirationDate: selectedOrder.voucher.expirationDate,
        senderName: selectedOrder.voucher.senderName,
        senderEmail: selectedOrder.voucher.senderEmail,
        receiverName: selectedOrder.voucher.receiverName,
        receiverEmail: selectedOrder.voucher.receiverEmail,
        message: selectedOrder.voucher.message,
        template: selectedOrder.voucher.template,
      },
    };
  };

  if (loading || !selectedOrder) {
    return (
      <DashboardLayout title="Preview Order">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading order details...</p>
        </div>
      </DashboardLayout>
    );
  }

  const formData = convertToFormData();

  return (
    <DashboardLayout>
      <Head>
        <title>Preview Order | Gifty Dashboard</title>
      </Head>

      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              type="text"
            />
            <Title level={4} style={{ margin: 0 }}>
              Voucher Preview
            </Title>
          </div>
        }
        extra={
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              loading={submitting}
            >
              Download PDF
            </Button>
            <Button
              icon={<MailOutlined />}
              onClick={handleResendEmails}
              loading={submitting}
            >
              Resend Emails
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 20 }}>
          <Text strong>Order ID:</Text> {selectedOrder.id || selectedOrder._id}
          <br />
          <Text strong>Voucher Code:</Text> {selectedOrder.voucher.code}
          <br />
          <Text strong>Status:</Text> {selectedOrder.voucher.status}
        </div>

        {formData && (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <OrderPreview data={formData} template={selectedOrder.voucher.template} />
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default PreviewOrderPage; 