import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { useState } from 'react';
import { 
  createOrder, 
  deleteOrder, 
  getOrderById, 
  getOrders, 
  resendAllEmails, 
  resendCustomerEmail, 
  resendReceiverEmail, 
  resendStoreEmail, 
  updateOrder, 
  downloadVoucherPdf
} from '../services/orderService';
import { Order, OrderFormData } from '../types';
import { useRouter } from 'next/router';

export const useOrders = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  // Fetch all orders with pagination and sorting
  const {
    data: ordersData,
    isLoading: loading,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['orders', sortField, sortOrder],
    queryFn: () => getOrders(1, 10, `${sortOrder === 'desc' ? '-' : ''}${sortField}`),
    staleTime: 60000, // 1 minute
    retry: false,
  });

  // Handle table sorting and pagination
  const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
    console.log('Table change:', sorter);
    
    // Handle sorting changes
    if (sorter && sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    } else {
      // Default sort by created date descending if no sort specified
      setSortField('createdAt');
      setSortOrder('desc');
    }
  };

  // If there was an error fetching orders, show notification
  if (ordersError) {
    notification.error({
      message: 'Error fetching orders',
      description: (ordersError as Error).message || 'Failed to load orders',
    });
  }

  // Fetch order by ID
  const fetchOrderById = async (id: string) => {
    try {
      const order = await getOrderById(id);
      setSelectedOrder(order);
      return order;
    } catch (error) {
      notification.error({
        message: 'Error fetching order',
        description: (error as Error).message || `Failed to load order with ID ${id}`,
      });
      throw error;
    }
  };

  // Create order mutation
  const {
    mutate: handleCreateOrder,
    isPending: isCreating,
  } = useMutation({
    mutationFn: (orderData: OrderFormData) => createOrder(orderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      notification.success({
        message: 'Order created',
        description: `Order has been created successfully!`,
      });
      router.push('/dashboard/orders');
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to create order',
        description: error.message || 'An error occurred while creating the order',
      });
    },
  });

  // Update order mutation
  const {
    mutate: handleUpdateOrder,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: ({ id, orderData }: { id: string; orderData: Partial<OrderFormData> }) =>
      updateOrder(id, orderData as OrderFormData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      notification.success({
        message: 'Order updated',
        description: `Order has been updated successfully!`,
      });
      router.push('/dashboard/orders');
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to update order',
        description: error.message || 'An error occurred while updating the order',
      });
    },
  });

  // Delete order mutation
  const {
    mutate: handleDeleteOrder,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      notification.success({
        message: 'Order deleted',
        description: 'Order has been deleted successfully!',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to delete order',
        description: error.message || 'An error occurred while deleting the order',
      });
    },
  });

  // Resend customer email mutation
  const {
    mutate: handleResendCustomerEmail,
    isPending: isResendingCustomerEmail,
  } = useMutation({
    mutationFn: (id: string) => resendCustomerEmail(id),
    onSuccess: () => {
      notification.success({
        message: 'Email sent',
        description: 'Customer email has been resent successfully!',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to resend email',
        description: error.message || 'An error occurred while resending the customer email',
      });
    },
  });

  // Resend receiver email mutation
  const {
    mutate: handleResendReceiverEmail,
    isPending: isResendingReceiverEmail,
  } = useMutation({
    mutationFn: (id: string) => resendReceiverEmail(id),
    onSuccess: () => {
      notification.success({
        message: 'Email sent',
        description: 'Receiver email has been resent successfully!',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to resend email',
        description: error.message || 'An error occurred while resending the receiver email',
      });
    },
  });

  // Resend store email mutation
  const {
    mutate: handleResendStoreEmail,
    isPending: isResendingStoreEmail,
  } = useMutation({
    mutationFn: (id: string) => resendStoreEmail(id),
    onSuccess: () => {
      notification.success({
        message: 'Email sent',
        description: 'Store email has been resent successfully!',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to resend email',
        description: error.message || 'An error occurred while resending the store email',
      });
    },
  });

  // Resend all emails mutation
  const {
    mutate: handleResendAllEmails,
    isPending: isResendingAllEmails,
  } = useMutation({
    mutationFn: (id: string) => resendAllEmails(id),
    onSuccess: () => {
      notification.success({
        message: 'Emails sent',
        description: 'All emails have been resent successfully!',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to resend emails',
        description: error.message || 'An error occurred while resending all emails',
      });
    },
  });

  // Download voucher PDF
  const {
    mutate: handleDownloadVoucherPdf,
    isPending: isDownloadingPdf,
  } = useMutation({
    mutationFn: (id: string) => downloadVoucherPdf(id),
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to download PDF',
        description: error.message || 'An error occurred while downloading the voucher PDF',
      });
    },
  });

  // Determine if any action is in progress
  const submitting = isCreating || isUpdating || isDeleting || 
                     isResendingCustomerEmail || isResendingReceiverEmail || 
                     isResendingStoreEmail || isResendingAllEmails || 
                     isDownloadingPdf;

  return {
    // Data
    orders: ordersData?.data || [],
    total: ordersData?.pagination?.total || 0,
    selectedOrder,
    loading,
    submitting,
    
    // Actions
    fetchOrderById,
    handleCreateOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    handleResendCustomerEmail,
    handleResendReceiverEmail,
    handleResendStoreEmail,
    handleResendAllEmails,
    handleDownloadVoucherPdf,
    handleTableChange,
  };
}; 