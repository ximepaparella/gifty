import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Card, Row, Col, Select, Spin, Typography, Upload, Space } from 'antd'
import { Store, StoreFormData, SocialLink } from '../types'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/features/users/services/userService'
import { User } from '@/features/users/types'
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload/interface'
import { message } from 'antd'

const { Option } = Select
const { Text } = Typography

interface StoreFormProps {
  initialValues?: Partial<Store>
  onSubmit: (data: StoreFormData) => Promise<void>
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
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    // Initialize fileList with initial logo if available
    if (initialValues?.logo) {
      const timestamp = new Date().getTime();
      const logoUrl = initialValues.logo.startsWith('http') 
        ? `${initialValues.logo}?t=${timestamp}` 
        : `${process.env.NEXT_PUBLIC_API_URL}${initialValues.logo}?t=${timestamp}`;
      
      return [{
        uid: '-1',
        name: 'store-logo',
        status: 'done',
        url: logoUrl
      }];
    }
    return [];
  })
  const userSelectedFile = React.useRef(false)
  const formInitialized = React.useRef(false)
  
  console.log('StoreForm rendered - isEditMode:', isEditMode)
  console.log('StoreForm initialValues:', initialValues)
  
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

  // Initialize form fields only once
  useEffect(() => {
    if (!initialValues || formInitialized.current) {
      return;
    }

    console.log("Initial form setup - setting fields");
    form.setFieldsValue({
      name: initialValues.name,
      email: initialValues.email,
      phone: initialValues.phone,
      address: initialValues.address,
      ownerId: initialValues.ownerId,
      instagram: initialValues.social?.instagram,
      facebook: initialValues.social?.facebook,
      tiktok: initialValues.social?.tiktok,
      youtube: initialValues.social?.youtube,
      others: initialValues.social?.others || []
    });
    
    formInitialized.current = true;
    console.log("Form initialization complete");
  }, [initialValues]);

  const handleSubmit = async (values: any) => {
    try {
      console.log('========== FORM SUBMISSION START ==========')
      console.log('Form values:', values)
      console.log('Form submission - logoFile state:', logoFile)
      console.log('Form submission - fileList state:', fileList)
      console.log('userSelectedFile flag:', userSelectedFile.current)
      
      // Track if we're updating the logo
      const isUpdatingLogo = isEditMode && logoFile !== null;
      
      const formData: StoreFormData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        ownerId: values.ownerId,
        logo: logoFile,
        social: {
          instagram: values.instagram || null,
          facebook: values.facebook || null,
          tiktok: values.tiktok || null,
          youtube: values.youtube || null,
          others: values.others || []
        }
      }
      
      console.log('Submitting store with data:', formData)
      console.log('Is Edit Mode:', isEditMode)
      console.log('Is Updating Logo:', isUpdatingLogo)
      console.log('File being sent in request:', logoFile)
      
      await onSubmit(formData)
      console.log('Submission completed successfully')
      
      // Reset userSelectedFile flag after successful submission
      userSelectedFile.current = false;
      console.log('userSelectedFile flag reset to false after submission')
      
      if (!initialValues) {
        console.log('No initialValues, resetting form')
        form.resetFields()
        setLogoFile(null)
        setFileList([])
      } else {
        console.log('Update mode, not resetting form')
        
        // No need to clear the fileList in update mode
        // The useEffect will handle updating the fileList when initialValues changes
        // Just clear the logoFile state so we don't keep it in memory
        if (isUpdatingLogo) {
          console.log('Logo was updated, clearing logoFile state but keeping fileList')
          setLogoFile(null)
        }
      }
      console.log('========== FORM SUBMISSION END ==========')
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    console.log('========== UPLOAD CHANGE START ==========')
    console.log('handleChange triggered with newFileList:', newFileList)
    
    // Update fileList state
    setFileList(newFileList)
    
    // Handle new file selection
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      console.log('New file selected:', newFileList[0].originFileObj)
      setLogoFile(newFileList[0].originFileObj)
      userSelectedFile.current = true
    } else if (newFileList.length === 0) {
      console.log('Clearing file states')
      setLogoFile(null)
      userSelectedFile.current = false
    }
    
    console.log('========== UPLOAD CHANGE END ==========')
  }

  const beforeUpload = (file: RcFile) => {
    console.log('========== BEFORE UPLOAD START ==========')
    
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('You can only upload image files!')
      return false
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!')
      return false
    }
    
    console.log('File passed validation')
    console.log('========== BEFORE UPLOAD END ==========')
    return false // Prevent auto upload
  }

  const handleRemove = () => {
    console.log('========== REMOVE START ==========')
    setLogoFile(null)
    setFileList([])
    userSelectedFile.current = false
    console.log('States cleared')
    console.log('========== REMOVE END ==========')
    return true
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

        <Form.Item
          name="logo"
          label="Logo de la tienda"
        >
          <Upload
            accept="image/*"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            maxCount={1}
            listType="picture-card"
            fileList={fileList}
            onRemove={handleRemove}
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
            }}
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Subir Logo</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Card title="Enlaces de Medios Sociales" style={{ marginBottom: 24 }}>
          <Form.Item name="instagram" label="Instagram">
            <Input placeholder="URL del perfil de Instagram" />
          </Form.Item>

          <Form.Item name="facebook" label="Facebook">
            <Input placeholder="URL del perfil de Facebook" />
          </Form.Item>

          <Form.Item name="tiktok" label="TikTok">
            <Input placeholder="URL del perfil de TikTok" />
          </Form.Item>

          <Form.Item name="youtube" label="YouTube">
            <Input placeholder="URL del canal de YouTube" />
          </Form.Item>

          <Form.List name="others">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Nombre del medio social faltante' }]}
                    >
                      <Input placeholder="Nombre del medio social" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'url']}
                      rules={[{ required: true, message: 'URL faltante' }]}
                    >
                      <Input placeholder="URL del perfil" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Agregar Otro Medio Social
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

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