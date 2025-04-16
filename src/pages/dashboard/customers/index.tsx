import React, { useEffect } from 'react'
import { Table, Space, Button, Popconfirm, Card, Row, Col, Input, Breadcrumb } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { Customer } from '@/features/customers/types'
import type { ColumnsType, TableProps } from 'antd/es/table'
import type { FilterValue, TablePaginationConfig } from 'antd/es/table/interface'
import Link from 'next/link'

// Ensure React Strict Mode doesn't cause findDOMNode warnings by disabling it in development
const strictModeOverride = {
  unstable_strictMode: false
}

const CustomersPage: React.FC = () => {
  const router = useRouter()
  const { 
    customers, 
    loading, 
    pagination, 
    handleDeleteCustomer, 
    handleTableChange 
  } = useCustomers()

  // Define custom search filter
  const getColumnSearchProps = (dataIndex: keyof Customer) => ({
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
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters?.()}
            size="small"
            style={{ width: 90 }}
          >
            Borrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: Customer) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase())
        : false
  })

  // Table columns with added filtering and sorting
  const columns: ColumnsType<Customer> = [
    {
      title: 'Nombre',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true,
      width: '25%',
      ...getColumnSearchProps('fullName')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '25%',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Teléfono',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: '20%',
      ...getColumnSearchProps('phoneNumber')
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '15%',
      render: (_: any, record: Customer) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => router.push(`/dashboard/customers/edit/${record._id}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de querer borrar este cliente?"
            onConfirm={() => handleDeleteCustomer(record._id)}
            okText="Sí"
            cancelText="No"
            placement="left"
          >
            <Button danger icon={<DeleteOutlined />}>
              Borrar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // Enhanced table change handler for sorting, filtering, and pagination
  const onTableChange: TableProps<Customer>['onChange'] = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    handleTableChange(pagination, filters, sorter)
  }

  return (
    <>
      <Head>
        <title>Clientes | Gifty Platform</title>
      </Head>
      <DashboardLayout title="Clientes" requiredRoles={['admin']}>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => router.push('/dashboard/customers/create')}
            >
              Añadir cliente
            </Button>
          </Col>
          <Col span={24}>
            <Card>
              <Table<Customer>
                dataSource={customers} 
                columns={columns} 
                rowKey="_id"
                loading={loading}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showTotal: (total) => `Total: ${total} clientes`
                }}
                onChange={onTableChange}
                scroll={{ x: 1000 }}
              />
            </Card>
          </Col>
        </Row>
      </DashboardLayout>
    </>
  )
}

export default CustomersPage 