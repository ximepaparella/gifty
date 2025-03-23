import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Spin } from 'antd';
import DashboardLayout from '@/layouts/DashboardLayout';
import OrderForm from '@/features/order/components/OrderForm';
import { useOrders } from '@/features/order/hooks/useOrders';
import { OrderFormData } from '@/features/order/types';

const EditOrderPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [orderId, setOrderId] = useState<string | null>(null);
  const { 
    selectedOrder, 
    loading, 
    submitting, 
    fetchOrderById, 
    handleUpdateOrder 
  } = useOrders();
  
  // Use a ref to track if we've already fetched data for this ID
  const fetchedRef = useRef<string | null>(null);

  // Set the orderId from the router query only when it changes and is a valid string
  useEffect(() => {
    if (id && typeof id === 'string' && id !== orderId) {
      console.log(`Setting orderId to: ${id}`);
      setOrderId(id);
    }
  }, [id]);  // Only depend on id changes, not orderId

  // Fetch data when orderId changes, but only if we haven't fetched for this ID already
  useEffect(() => {
    if (orderId && fetchedRef.current !== orderId) {
      console.log(`Fetching order data for ID: ${orderId}`);
      fetchedRef.current = orderId; // Mark this ID as fetched
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);  // Only depend on orderId and the fetch function

  const handleSubmit = (values: OrderFormData) => {
    if (orderId) {
      handleUpdateOrder({ id: orderId, orderData: values });
    }
  };

  if (loading || !selectedOrder) {
    return (
      <DashboardLayout title="Edit Order">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading order details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Order">
      <Head>
        <title>Edit Order | Gifty Dashboard</title>
      </Head>

      <OrderForm 
        initialValues={selectedOrder} 
        onSubmit={handleSubmit} 
        loading={submitting} 
      />
    </DashboardLayout>
  );
};

export default EditOrderPage; 