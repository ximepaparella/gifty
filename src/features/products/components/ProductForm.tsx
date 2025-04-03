import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, InputNumber, Upload, Select, message } from 'antd';
import { Product, ProductFormData } from '../types';
import { useRouter } from 'next/router';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { useStores } from '@/features/stores/hooks/useStores';
import { Types } from 'mongoose';

const { Option } = Select;

interface ProductFormProps {
  initialValues?: Partial<Product>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  loading?: boolean;
  storeId?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  loading = false,
  storeId: defaultStoreId
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { stores, loading: loadingStores } = useStores();

  // Initialize fileList with existing image if available
  useEffect(() => {
    if (initialValues?.image) {
      const imageUrl = initialValues.image.startsWith('http') 
        ? initialValues.image 
        : `${process.env.NEXT_PUBLIC_API_URL}${initialValues.image}`;
      
      setFileList([{
        uid: '-1',
        name: 'product-image',
        status: 'done',
        url: imageUrl
      }]);
    }
  }, [initialValues?.image]);

  const handleSubmit = async (values: any) => {
    try {
      // Get the selected store ID or default store ID
      const selectedStoreId = values.storeId || defaultStoreId;
      
      if (!selectedStoreId) {
        message.error('Por favor seleccione una tienda');
        return;
      }

      // Ensure it's a valid MongoDB ObjectId
      if (!Types.ObjectId.isValid(selectedStoreId)) {
        message.error('ID de tienda inválido');
        return;
      }

      // Get the actual File object from the Upload component
      const currentImage = fileList[0]?.originFileObj;

      // Create form data with all required fields
      const formData: ProductFormData = {
        name: values.name,
        description: values.description,
        price: values.price,
        storeId: selectedStoreId,
        isActive: true,
      };

      // Only add image if we have a valid File object
      if (currentImage instanceof File) {
        formData.image = currentImage;
      }
      
      await onSubmit(formData);
      if (!initialValues) {
        form.resetFields();
        setImageFile(null);
        setFileList([]);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Error al crear el producto');
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const file = newFileList[0];
    
    // Only update if it's a new file or clearing the list
    if ((file?.originFileObj instanceof File) || newFileList.length === 0) {
      setFileList(newFileList);
      setImageFile(file?.originFileObj || null);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Solo se permiten archivos de imagen');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe ser menor a 2MB');
      return false;
    }
    return false; // Prevent auto upload
  };

  const handleRemove = () => {
    setImageFile(null);
    setFileList([]);
    return true;
  };

  return (
    <Card title={initialValues ? 'Editar Producto' : 'Crear Producto'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: initialValues?.name,
          description: initialValues?.description,
          price: initialValues?.price,
          storeId: defaultStoreId || initialValues?.storeId
        }}
      >
        {!defaultStoreId && (
          <Form.Item
            name="storeId"
            label="Tienda"
            rules={[{ required: true, message: 'Por favor seleccione una tienda' }]}
          >
            <Select
              loading={loadingStores}
              placeholder="Seleccione una tienda"
              showSearch
              optionFilterProp="children"
            >
              {stores?.map(store => (
                <Option key={store._id || store.id} value={store._id || store.id}>
                  {store.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="name"
          label="Nombre del Producto"
          rules={[
            { required: true, message: 'Por favor ingrese el nombre del producto' },
            { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
          ]}
        >
          <Input placeholder="Ingrese el nombre del producto" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descripción"
          rules={[
            { required: true, message: 'Por favor ingrese la descripción' },
            { min: 10, message: 'La descripción debe tener al menos 10 caracteres' }
          ]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Ingrese una descripción detallada del producto"
          />
        </Form.Item>

        <Form.Item
          name="price"
          label="Precio"
          rules={[
            { required: true, message: 'Por favor ingrese el precio' },
            { type: 'number', min: 0, message: 'El precio debe ser mayor a 0' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            placeholder="Ingrese el precio del producto"
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="Imagen del Producto"
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
                <div style={{ marginTop: 8 }}>Subir Imagen</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
          <Button 
            style={{ marginLeft: 8 }} 
            onClick={() => router.push('/dashboard/products')}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductForm; 