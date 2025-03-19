import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Card, Row, Col, Select, Spin, Typography } from 'antd'
import { Store, StoreFormData } from '../types'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/features/users/services/userService'
import { User } from '@/features/users/types'

const { Option } = Select
const { Text } = Typography

interface StoreFormProps {
  initialValues?: Store
  onSubmit: (values: StoreFormData) => Promise<void>
  isLoading: boolean
  title: string
  isEditMode?: boolean
}

const StoreForm: React.FC<StoreFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  title,
  isEditMode = false
}) => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [currentOwner, setCurrentOwner] = useState<User | null>(null)
  
  // Fetch users for the owner dropdown
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['users-dropdown'],
    queryFn: () => getUsers(1, 100), // Get a larger batch of users for the dropdown
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  })
  
  // Extract users for dropdown, focusing on store managers and admins
  const users = usersData?.data || []
  const eligibleOwners = users.filter(user => 
    user.role === 'admin' || user.role === 'store_manager'
  )

  // Find current owner when in edit mode
  useEffect(() => {
    if (initialValues?.ownerId && users.length > 0) {
      const foundOwner = users.find(user => user.id === initialValues.ownerId)
      setCurrentOwner(foundOwner || null)
      
      console.log("Current Owner ID:", initialValues.ownerId)
      console.log("Found Owner:", foundOwner)
    }
  }, [initialValues?.ownerId, users])

  useEffect(() => {
    if (initialValues) {
      console.log("Initial values for store form:", initialValues)
      
      form.setFieldsValue({
        name: initialValues.name,
        email: initialValues.email,
        phone: initialValues.phone,
        address: initialValues.address,
        ownerId: initialValues.ownerId
      })
    }
  }, [initialValues, form])

  const handleSubmit = async (values: StoreFormData) => {
    try {
      await onSubmit(values)
    } catch (error) {
      // Error is handled by the hook
      console.error('Form submission error:', error)
    }
  }

  return (
    <Card title={title}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Nombre"
              rules={[
                { required: true, message: 'Nombre de la tienda es requerido' },
                { min: 2, message: 'Nombre debe tener al menos 2 caracteres' },
                { max: 50, message: 'Nombre no puede exceder 50 caracteres' }
              ]}
            >
              <Input placeholder="Ingresar nombre de la tienda" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email es requerido' },
                { type: 'email', message: 'Por favor, proporciona una dirección de correo electrónico válida' }
              ]}
            >
              <Input placeholder="Ingresar email de contacto" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Teléfono"
              rules={[
                { required: true, message: 'Teléfono es requerido' }
              ]}
            >
              <Input placeholder="Ingresar número de teléfono" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="address"
              label="Dirección"
              rules={[
                { required: true, message: 'Dirección es requerida' }
              ]}
            >
              <Input placeholder="Ingresar dirección de la tienda" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="ownerId"
              label={
                <span>
                  Propietario 
                  {isEditMode && currentOwner && (
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      (Actual: {currentOwner.name})
                    </Text>
                  )}
                </span>
              }
              rules={[
                { required: true, message: 'Propietario de la tienda es requerido' }
              ]}
            >
              <Select 
                placeholder={loadingUsers ? "Cargando propietarios..." : "Seleccionar propietario"}
                loading={loadingUsers}
                disabled={loadingUsers}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                {eligibleOwners.map((user: User) => (
                  <Option key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {user.role === 'admin' ? 'Administrador' : 'Gerente'}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEditMode ? 'Actualizar tienda' : 'Crear tienda'}
          </Button>
          <Button 
            style={{ marginLeft: 8 }} 
            onClick={() => router.push('/dashboard/stores')}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default StoreForm 