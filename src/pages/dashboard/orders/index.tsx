import React, { useState } from 'react';
import { Button, Card, Modal, Table, Tag, Tooltip, Space, Dropdown, notification } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  MailOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useOrders } from '@/features/order/hooks/useOrders';
import dayjs from '@/utils/dayjs';
import { Order } from '@/features/order/types';
import { ColumnsType } from 'antd/es/table';

const OrdersPage: React.FC = () => {
  const {
    orders,
    total,
    loading,
    submitting,
    handleDeleteOrder,
    handleDownloadVoucherPdf,
    handleResendAllEmails,
    handleTableChange,
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Table columns configuration
  const columns: ColumnsType<Order> = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: 'id',
      render: (_id: string, record: Order) => {
        const id = record.id || record._id;
        return <span style={{ fontFamily: 'monospace' }}>{id?.slice(-8) || '-'}</span>;
      },
    },
    {
      title: 'Customer Email',
      dataIndex: ['paymentDetails', 'paymentEmail'],
      key: 'customerEmail',
      render: (email: string) => email || '-',
    },
    {
      title: 'Receiver',
      dataIndex: ['voucher', 'receiverName'],
      key: 'receiver',
      render: (name: string) => name || '-',
    },
    {
      title: 'Code',
      dataIndex: ['voucher', 'code'],
      key: 'code',
      render: (code: string) => <Tag color="blue">{code || '-'}</Tag>,
    },
    {
      title: 'Amount',
      dataIndex: ['paymentDetails', 'amount'],
      key: 'amount',
      render: (amount: number) => `$${amount?.toFixed(2) || 0}`,
    },
    {
      title: 'Status',
      dataIndex: ['voucher', 'status'],
      key: 'status',
      render: (status: 'active' | 'redeemed' | 'expired') => {
        let color = '';
        switch (status) {
          case 'active':
            color = 'green';
            break;
          case 'redeemed':
            color = 'blue';
            break;
          case 'expired':
            color = 'red';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status || 'unknown'}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      defaultSortOrder: 'descend', // Default sort by newest first
      render: (date: string) => (date ? dayjs(date).format('YYYY-MM-DD') : '-'),
    },
    {
      title: 'Expiration',
      dataIndex: ['voucher', 'expirationDate'],
      key: 'expirationDate',
      render: (date: string) => {
        if (!date) return '-';
        const expirationDate = dayjs(date);
        const isExpired = expirationDate.isBefore(dayjs());
        return (
          <Tag color={isExpired ? 'red' : 'green'}>
            {expirationDate.format('YYYY-MM-DD')}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Order) => {
        const items = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => {
              const id = record.id || record._id;
              if (id) {
                window.location.href = `/dashboard/orders/edit/${id}`;
              }
            },
          },
          {
            key: 'preview',
            label: 'Preview',
            icon: <EyeOutlined />,
            onClick: () => {
              const id = record.id || record._id;
              if (id) {
                window.location.href = `/dashboard/orders/preview/${id}`;
              }
            },
          },
          {
            key: 'download',
            label: 'Download PDF',
            icon: <DownloadOutlined />,
            onClick: () => {
              const id = record.id || record._id;
              if (id) {
                try {
                  handleDownloadVoucherPdf(id);
                } catch (error) {
                  notification.error({
                    message: 'Download Failed',
                    description: 'Failed to download PDF. The file might not be available yet.'
                  });
                }
              }
            },
          },
          {
            key: 'resend',
            label: 'Resend Emails',
            icon: <MailOutlined />,
            onClick: () => {
              const id = record.id || record._id;
              if (id) {
                try {
                  handleResendAllEmails(id);
                  notification.success({
                    message: 'Request Sent',
                    description: 'Email resend request has been sent.'
                  });
                } catch (error) {
                  notification.error({
                    message: 'Resend Failed',
                    description: 'Failed to resend emails. Please try again later.'
                  });
                }
              }
            },
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              setSelectedOrder(record);
              setIsDeleteModalVisible(true);
            },
          },
        ];

        return (
          <Space size="small">
            <Dropdown menu={{ items }} trigger={['click']}>
              <Button 
                icon={<EllipsisOutlined />} 
                type="text"
                disabled={submitting}
              />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  // Confirm order deletion
  const confirmDelete = () => {
    if (selectedOrder && (selectedOrder.id || selectedOrder._id)) {
      handleDeleteOrder(selectedOrder.id || selectedOrder._id as string);
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Orders | Gifty Dashboard</title>
      </Head>

      <Card
        title="Orders"
        // extra={
        //   <Link href="/dashboard/orders/create">
        //     <Button type="primary">Create Order</Button>
        //   </Link>
        // }
      >
        <Table
          columns={columns}
          dataSource={orders}
          rowKey={(record) => record.id || record._id || ''}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: submitting }}
      >
        <p>Are you sure you want to delete this order?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
};

export default OrdersPage; 