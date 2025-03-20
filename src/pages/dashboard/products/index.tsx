import React, { useEffect } from 'react'
import { Table, Space, Button, Popconfirm, Card, Row, Col, Tag, Input, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import { useProducts } from '@/features/product/hooks/useProducts'
import { Product } from '@/features/product/types'
import type { ColumnsType, TableProps } from 'antd/es/table'
import type { FilterValue, TablePaginationConfig } from 'antd/es/table/interface'

const ProductsPage: React.FC = () => {
  const router = useRouter()
  const { 
    products, 
    loading, 
    pagination, 
    handleDeleteProduct, 
    handleTableChange 
  } = useProducts()
  
  // Debug products data in component
  useEffect(() => {
    console.log("Products data in component:", products)
    console.log("Products count:", products?.length)
  }, [products])

  // Define custom search filter
  const getColumnSearchProps = (dataIndex: keyof Product) => ({
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
    onFilter: (value: any, record: Product) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase())
        : false
  })

  const columns: ColumnsType<Product> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      ...getColumnSearchProps('name'),
      render: (text: string) => <a>{text}</a>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      render: (price: number) => `$${price?.toFixed(2) || '0.00'}`
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false }
      ],
      onFilter: (value: any, record: Product) => record.isActive === value,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
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
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => router.push(`/dashboard/products/edit/${record._id || record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record._id || record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button  danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // Type-safe table change handler
  const onTableChange: TableProps<Product>['onChange'] = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    handleTableChange(pagination, filters, sorter);
  };

  return (
    <>
      <Head>
        <title>Products | Gifty Dashboard</title>
      </Head>
      <DashboardLayout title="Products">
        <Card
          title="Products"
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => router.push('/dashboard/products/create')}
            >
              Add Product
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={products}
            rowKey={record => (record._id || record.id || String(Math.random())).toString()}
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

export default ProductsPage 