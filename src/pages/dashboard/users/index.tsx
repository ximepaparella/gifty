import React, { useEffect } from 'react'
import { Table, Space, Button, Popconfirm, Card, Row, Col, Input, Tag, Breadcrumb } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import { useUsers } from '@/features/users/hooks/useUsers'
import { User } from '@/features/users/types'
import type { ColumnsType, TableProps } from 'antd/es/table'
import type { FilterValue, TablePaginationConfig } from 'antd/es/table/interface'
import Link from 'next/link'

// Ensure React Strict Mode doesn't cause findDOMNode warnings by disabling it in development
// This can be removed once Ant Design updates their components to not use findDOMNode
const strictModeOverride = {
  unstable_strictMode: false
}

const UsersPage: React.FC = () => {
  const router = useRouter()
  const { 
    users, 
    loading, 
    pagination, 
    handleDeleteUser, 
    handleTableChange 
  } = useUsers()

  // Debug users data in component
  useEffect(() => {
    console.log("Users data in component:", users);
    console.log("User count:", users?.length);
  }, [users]);

  // Get all unique roles from user data for dynamic filtering
  const getRoleFilters = () => {
    const roles = new Set(users.map(user => user.role))
    return Array.from(roles).map(role => ({
      text: role.charAt(0).toUpperCase() + role.slice(1),
      value: role
    }))
  }

  // Define custom search filter
  const getColumnSearchProps = (dataIndex: keyof User) => ({
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
    onFilter: (value: any, record: User) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase())
        : false
  })

  // Table columns with added filtering and sorting
  const columns: ColumnsType<User> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: '20%',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '25%',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      width: '15%',
      sorter: true,
      filters: getRoleFilters(),
      onFilter: (value: any, record: User) => record.role === value,
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : role === 'store_manager' ? 'blue' : 'green'}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Tag>
      )
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
      width: '25%',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => router.push(`/dashboard/users/edit/${record.id}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de querer borrar este usuario?"
            onConfirm={() => handleDeleteUser(record.id)}
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
  const onTableChange: TableProps<User>['onChange'] = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    handleTableChange(pagination, filters, sorter)
  }

  return (
    <>
      <Head>
        <title>Usuarios | Gifty Platform</title>
      </Head>
      <DashboardLayout title="Usuarios" requiredRoles={['admin']}>

        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => router.push('/dashboard/users/create')}
            >
              Añadir usuario
            </Button>
          </Col>
          <Col span={24}>
            <Card>
              <Table<User>
                dataSource={users} 
                columns={columns} 
                rowKey="id"
                loading={loading}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showTotal: (total) => `Total: ${total} usuarios`
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

export default UsersPage 