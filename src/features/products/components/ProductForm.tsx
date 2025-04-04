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
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    if (initialValues?.image) {
      const timestamp = new Date().getTime();
      const imageUrl = initialValues.image.startsWith('http') 
        ? `${initialValues.image}?t=${timestamp}` 
        : `${process.env.NEXT_PUBLIC_API_URL}${initialValues.image}?t=${timestamp}`;
      
      return [{
        uid: '-1',
        name: 'product-image',
        status: 'done',
        url: imageUrl
      }];
    }
    return [];
  });
  const { stores, loading: loadingStores } = useStores();
  const userSelectedFile = React.useRef(false);
  const formInitialized = React.useRef(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      console.log('========== FORM SUBMISSION START ==========');
      console.log('Form values:', values);
      console.log('Image file state:', imageFile);
      console.log('FileList state:', fileList);
      
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

      if (!imageFile) {
        message.error('Por favor seleccione una imagen');
        return;
      }

      // Create product data object
      const productData: ProductFormData = {
        name: values.name,
        description: values.description,
        price: values.price,
        storeId: selectedStoreId,
        isActive: true,
        image: imageFile // Pass the File object directly
      };

      console.log('Submitting product with data:', productData);
      await onSubmit(productData);
      
      if (!initialValues) {
        console.log('No initialValues, resetting form');
        form.resetFields();
        setImageFile(null);
        setFileList([]);
        userSelectedFile.current = false;
      }
      
      console.log('========== FORM SUBMISSION END ==========');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Error al crear el producto');
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    console.log('========== UPLOAD CHANGE START ==========');
    console.log('handleChange triggered with newFileList:', newFileList);
    
    // Update fileList state
    setFileList(newFileList);
    
    // Handle new file selection
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      console.log('New file selected:', newFileList[0].originFileObj);
      setImageFile(newFileList[0].originFileObj);
      userSelectedFile.current = true;
    } else if (newFileList.length === 0) {
      console.log('Clearing file states');
      setImageFile(null);
      userSelectedFile.current = false;
    }
    
    console.log('========== UPLOAD CHANGE END ==========');
  };

  const beforeUpload = (file: RcFile) => {
    console.log('========== BEFORE UPLOAD START ==========');
    
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
    
    console.log('File passed validation');
    console.log('========== BEFORE UPLOAD END ==========');
    return false; // Prevent auto upload
  };

  const handleRemove = () => {
    console.log('========== REMOVE START ==========');
    setImageFile(null);
    setFileList([]);
    userSelectedFile.current = false;
    console.log('States cleared');
    console.log('========== REMOVE END ==========');
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
          rules={[{ required: true, message: 'Por favor seleccione una imagen' }]}
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
          <Button type="primary" htmlType="submit" loading={loading || uploadingImage}>
            {initialValues ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
          <Button 
            style={{ marginLeft: 8 }} 
            onClick={() => router.push('/dashboard/products')}
            disabled={uploadingImage}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductForm; 