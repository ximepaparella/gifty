import React, { useEffect } from 'react'
import { Table, Space, Button, Popconfirm, Card, Row, Col, Tag, Input, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import { useVouchers } from '@/features/vouchers/hooks/useVouchers'
import { Voucher } from '@/features/vouchers/types'
import type { ColumnsType, TableProps } from 'antd/es/table'
import type { FilterValue, TablePaginationConfig } from 'antd/es/table/interface'

const VouchersPage: React.FC = () => {
  const router = useRouter()
  const { 
    vouchers, 
    loading, 
    pagination, 
    handleTableChange,
    handleDeleteVoucher
  } = useVouchers()
  
  // Debug vouchers data in component
  useEffect(() => {
    console.log("Vouchers data in component:", vouchers)
    console.log("Vouchers count:", vouchers?.length)
  }, [vouchers])

  // Define custom search filter
  const getColumnSearchProps = (dataIndex: keyof Voucher) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Clear
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: Voucher) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase())
        : false
  })

  const columns: ColumnsType<Voucher> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
      ...getColumnSearchProps('code'),
      render: (text: string) => <a>{text}</a>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      render: (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return '$0.00';
        return `$${amount.toFixed(2)}`;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Redeemed', value: 'redeemed' },
        { text: 'Expired', value: 'expired' }
      ],
      onFilter: (value: any, record: Voucher) => record.status === value,
      render: (status: string) => {
        let color = 'green';
        if (status === 'redeemed') color = 'blue';
        if (status === 'expired') color = 'red';
        
        return (
          <Tag color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Receiver',
      dataIndex: 'receiverName',
      key: 'receiverName',
      ...getColumnSearchProps('receiverName'),
      render: (text: string, record: Voucher) => (
        <Tooltip title={record.receiverEmail}>
          {text}
        </Tooltip>
      )
    },
    {
      title: 'Sender',
      dataIndex: 'senderName',
      key: 'senderName',
      ...getColumnSearchProps('senderName'),
      render: (text: string, record: Voucher) => (
        <Tooltip title={record.senderEmail}>
          {text}
        </Tooltip>
      )
    },
    {
      title: 'Expiration',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Voucher) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => router.push(`/dashboard/vouchers/edit/${record._id || record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this voucher?"
            onConfirm={() => {
              const id = record._id || record.id;
              if (id) handleDeleteVoucher(id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // Type-safe table change handler
  const onTableChange: TableProps<Voucher>['onChange'] = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    handleTableChange(pagination, filters, sorter);
  };

  return (
    <>
      <Head>
        <title>Vouchers | Gifty Dashboard</title>
      </Head>
      <DashboardLayout title="Vouchers">
        <Card
          title="Vouchers"
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => router.push('/dashboard/vouchers/create')}
            >
              Add Voucher
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={vouchers}
            rowKey={record => {
              const id = record._id || record.id;
              if (!id) {
                console.warn('Voucher without ID found:', record);
                // Use a more stable identifier if possible, like a combination of other fields
                return `${record.code}-${record.createdAt}`;
              }
              return id.toString();
            }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`
            }}
            loading={loading}
            onChange={onTableChange}
          />
        </Card>
      </DashboardLayout>
    </>
  )
}

export default VouchersPage 