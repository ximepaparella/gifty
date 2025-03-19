import React, { useEffect } from 'react'
import { Form, Input, Button, Select, Card, Row, Col } from 'antd'
import { User, UserFormData } from '../types'
import { useRouter } from 'next/router'

const { Option } = Select

interface UserFormProps {
  initialValues?: User
  onSubmit: (values: UserFormData) => Promise<void>
  isLoading: boolean
  title: string
  isEditMode?: boolean
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  title,
  isEditMode = false
}) => {
  const [form] = Form.useForm()
  const router = useRouter()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        email: initialValues.email,
        role: initialValues.role
      })
    }
  }, [initialValues, form])

  const handleSubmit = async (values: UserFormData) => {
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
                { required: true, message: 'Nombre es requerido' },
                { min: 2, message: 'Nombre debe tener al menos 2 caracteres' },
                { max: 50, message: 'Nombre no puede exceder 50 caracteres' }
              ]}
            >
              <Input placeholder="Ingresar nombre" />
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
              <Input placeholder="Ingresar email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                { required: !isEditMode, message: 'Contraseña es requerida para nuevos usuarios' },
                { min: 8, message: 'Contraseña debe tener al menos 8 caracteres' }
              ]}
            >
              <Input.Password 
                  placeholder={isEditMode ? "Dejar en blanco para mantener la contraseña actual" : "Ingresar contraseña"} 
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="role"
              label="Rol"
              rules={[{ required: true, message: 'Rol es requerido' }]}
            >
              <Select placeholder="Seleccionar un rol">
                <Option value="admin">Admin</Option>
                <Option value="store_manager">Manager</Option>
                <Option value="customer">Customer</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEditMode ? 'Actualizar usuario' : 'Crear usuario'}
          </Button>
          <Button 
            style={{ marginLeft: 8 }} 
            onClick={() => router.push('/dashboard/users')}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default UserForm 