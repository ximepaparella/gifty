import React from 'react'
import { Table, Space, Button, Popconfirm, Card, Row, Col, Input, Tag, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import { useStores } from '@/features/stores/hooks/useStores'
import { useStoreOwners } from '@/features/stores/hooks/useStoreOwners'
import { Store } from '@/features/stores/types'
import type { ColumnsType, TableProps } from 'antd/es/table'
import type { FilterValue, TablePaginationConfig } from 'antd/es/table/interface'

const StoresPage: React.FC = () => {
  const router = useRouter()
  const { 
    stores, 
    loading, 
    pagination, 
    handleDeleteStore, 
    handleTableChange 
  } = useStores()
  
  // Use the hook to resolve owner information
  const { getOwnerById, isLoading: loadingOwners } = useStoreOwners()

  // Define custom search filter
  const getColumnSearchProps = (dataIndex: keyof Store) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${dataIndex}`}
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
            onClick={() => clearFilters && clearFilters()}
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
    onFilter: (value: any, record: Store) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase())
        : false
  })

  // Table columns with added filtering and sorting
  const columns: ColumnsType<Store> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: '15%',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '15%',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Propietario',
      dataIndex: 'ownerId',
      key: 'ownerId',
      width: '15%',
      render: (ownerId: string) => {
        const owner = getOwnerById(ownerId)
        
        if (loadingOwners) {
          return <span>Cargando...</span>
        }
        
        if (!owner) {
          return (
            <Tooltip title={`ID: ${ownerId}`}>
              <Tag icon={<UserOutlined />} color="default">
                Propietario no encontrado
              </Tag>
            </Tooltip>
          )
        }
        
        return (
          <Tooltip title={`ID: ${ownerId}`}>
            <Tag 
              icon={<UserOutlined />} 
              color={owner.role === 'admin' ? 'red' : 'blue'}
            >
              {owner.name} ({owner.role === 'admin' ? 'Admin' : 'Gerente'})
            </Tag>
          </Tooltip>
        )
      }
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
      width: '10%',
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address',
      width: '20%',
      ...getColumnSearchProps('address')
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '15%',
      render: (_: any, record: Store) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => router.push(`/dashboard/stores/edit/${record._id}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de querer borrar esta tienda?"
            onConfirm={() => handleDeleteStore(record._id)}
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
  const onTableChange: TableProps<Store>['onChange'] = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    handleTableChange(pagination, filters, sorter)
  }

  return (
    <>
      <Head>
        <title>Tiendas | Gifty Platform</title>
      </Head>
      <DashboardLayout title="Tiendas" requiredRoles={['admin', 'store_manager']}>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => router.push('/dashboard/stores/create')}
            >
              Añadir tienda
            </Button>
          </Col>
          <Col span={24}>
            <Card>
              <Table<Store>
                dataSource={stores} 
                columns={columns} 
                key={stores.map(store => store._id).toString()}
                rowKey="_id"
                loading={loading}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showTotal: (total) => `Total: ${total} tiendas`
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

export default StoresPage 