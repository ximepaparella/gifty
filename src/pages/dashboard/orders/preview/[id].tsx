import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Spin, Card, Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, MailOutlined } from '@ant-design/icons';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useOrders } from '@/features/order/hooks/useOrders';
import OrderPreview from '@/features/order/components/OrderPreview';
import { OrderFormData } from '@/features/order/types';
import { useProducts } from '@/features/product/hooks/useProducts';
import { useStores } from '@/features/stores/hooks/useStores';

const { Title, Text } = Typography;

const PreviewOrderPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [orderId, setOrderId] = useState<string | null>(null);
  // Use a ref to track if we've already fetched data for this ID
  const fetchedRef = useRef<string | null>(null);
  
  const {
    selectedOrder,
    loading,
    submitting,
    fetchOrderById,
    handleDownloadVoucherPdf,
    handleResendAllEmails,
  } = useOrders();
  
  // Add hooks for product and store data
  const { fetchProductById, selectedProduct, loading: loadingProduct } = useProducts();
  const { fetchStoreById, selectedStore, loading: loadingStore } = useStores();

  // Set the orderId from the router query
  useEffect(() => {
    if (id && typeof id === 'string' && id !== orderId) {
      console.log(`Setting preview orderId to: ${id}`);
      setOrderId(id);
    }
  }, [id]);  // Only depend on id changes, not orderId

  // Fetch data when orderId changes, but only if we haven't fetched for this ID already
  useEffect(() => {
    if (orderId && fetchedRef.current !== orderId) {
      console.log(`Fetching preview order data for ID: ${orderId}`);
      fetchedRef.current = orderId; // Mark this ID as fetched
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);
  
  // Fetch product and store data when order is loaded
  useEffect(() => {
    if (selectedOrder && selectedOrder.voucher) {
      console.log('Order loaded, fetching related data');
      
      // Fetch product data if available
      if (selectedOrder.voucher.productId) {
        console.log(`Fetching product: ${selectedOrder.voucher.productId}`);
        fetchProductById(selectedOrder.voucher.productId);
      }
      
      // Fetch store data if available
      if (selectedOrder.voucher.storeId) {
        console.log(`Fetching store: ${selectedOrder.voucher.storeId}`);
        fetchStoreById(selectedOrder.voucher.storeId);
      }
    }
  }, [selectedOrder, fetchProductById, fetchStoreById]);

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

    // Create a debug log of the original order data to see what fields are available
    console.log("Original order for conversion:", JSON.stringify(selectedOrder, null, 2));

    return {
      customerId: selectedOrder.customerId,
      paymentDetails: selectedOrder.paymentDetails,
      voucher: {
        storeId: selectedOrder.voucher?.storeId || '',
        productId: selectedOrder.voucher?.productId || '',
        expirationDate: selectedOrder.voucher?.expirationDate || '',
        senderName: selectedOrder.voucher?.senderName || '',
        senderEmail: selectedOrder.voucher?.senderEmail || '',
        receiverName: selectedOrder.voucher?.receiverName || '',
        receiverEmail: selectedOrder.voucher?.receiverEmail || '',
        message: selectedOrder.voucher?.message || '',
        template: selectedOrder.voucher?.template || '',
        // Include additional fields that might be present in the original voucher details but not in OrderFormData
        ...(selectedOrder.voucher?.code && { code: selectedOrder.voucher.code }),
        ...(selectedOrder.voucher?.status && { status: selectedOrder.voucher.status }),
        ...(selectedOrder.voucher?.qrCode && { qrCode: selectedOrder.voucher.qrCode }),
        ...(selectedOrder.voucher?.isRedeemed !== undefined && { isRedeemed: selectedOrder.voucher.isRedeemed }),
        ...(selectedOrder.voucher?.redeemedAt && { redeemedAt: selectedOrder.voucher.redeemedAt }),
      },
    };
  };

  const isLoading = loading || loadingProduct || loadingStore;

  if (isLoading || !selectedOrder) {
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
          {selectedProduct && (
            <>
              <br />
              <Text strong>Product:</Text> {selectedProduct.name}
            </>
          )}
          {selectedStore && (
            <>
              <br />
              <Text strong>Store:</Text> {selectedStore.name}
            </>
          )}
        </div>

        {formData && (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <OrderPreview 
              data={formData} 
              template={selectedOrder.voucher.template} 
              voucherCode={selectedOrder.voucher.code}
              productInfo={selectedProduct}
              storeInfo={selectedStore}
              selectedOrder={selectedOrder}
            />
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default PreviewOrderPage; 