import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import OrderForm from '@/features/order/components/OrderForm';
import { useOrders } from '@/features/order/hooks/useOrders';
import { OrderFormData } from '@/features/order/types';

const CreateOrderPage: React.FC = () => {
  const { handleCreateOrder, submitting } = useOrders();

  const handleSubmit = (values: OrderFormData) => {
    handleCreateOrder(values);
  };

  return (
    <DashboardLayout title="Create Order">
      <Head>
        <title>Create Order | Gifty Dashboard</title>
      </Head>

      <OrderForm onSubmit={handleSubmit} loading={submitting} />
    </DashboardLayout>
  );
};

export default CreateOrderPage; 