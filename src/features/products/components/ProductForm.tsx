import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, InputNumber, Upload, Select, message, Spin } from 'antd';
import { Product, ProductFormData } from '../types';
import { useRouter } from 'next/router';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { useStores } from '@/features/stores/hooks/useStores';
import { Types } from 'mongoose';
import { uploadProductImage } from '../services/productService';

const { Option } = Select;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
const ERROR_MESSAGES = {
  FILE_TYPE: 'Solo se permiten archivos JPG y PNG',
  FILE_SIZE: 'La imagen no debe superar los 2MB',
  REQUIRED_NAME: 'Por favor ingrese el nombre del producto',
  REQUIRED_DESCRIPTION: 'Por favor ingrese una descripción',
  MIN_DESCRIPTION: 'La descripción debe tener al menos 10 caracteres',
  REQUIRED_PRICE: 'Por favor ingrese el precio',
};

interface ProductFormProps {
  initialValues?: Partial<Product>;
  onSubmit: (data: Omit<ProductFormData, 'image'>) => Promise<Product>;
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
      return [{
        uid: '-1',
        name: 'current-image',
        status: 'done',
        url: initialValues.image
      }];
    }
    return [];
  });
  const { stores, loading: loadingStores } = useStores();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      console.log('=== Form Submission Start ===');
      console.log('Form values:', values);
      console.log('Image file state:', imageFile);
      console.log('Is imageFile a File?', imageFile instanceof File);
      console.log('FileList state:', fileList);
      
      // Create product data object
      const productData = {
        ...values,
        image: imageFile // Send the actual File object, not the fileList item
      };
      
      console.log('Product data being sent:', {
        ...productData,
        image: productData.image ? {
          name: productData.image.name,
          type: productData.image.type,
          size: productData.image.size
        } : null
      });

      // Submit the form data
      const response = await onSubmit(productData);
      console.log('Form submission response:', response);
      
      // Reset form if it's a new product
      if (!initialValues) {
        form.resetFields();
        setImageFile(null);
        setFileList([]);
      }
      
      message.success(initialValues ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Error al procesar el formulario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    console.log('=== File Change Start ===');
    console.log('New file list:', newFileList);
    console.log('First file:', newFileList[0]);
    console.log('First file originFileObj:', newFileList[0]?.originFileObj);
    
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      console.log('Setting new image file:', {
        name: newFileList[0].originFileObj.name,
        type: newFileList[0].originFileObj.type,
        size: newFileList[0].originFileObj.size
      });
      setImageFile(newFileList[0].originFileObj);
    } else {
      console.log('Clearing image file');
      setImageFile(null);
    }
  };

  const beforeUpload = (file: RcFile) => {
    console.log('=== Before Upload Start ===');
    console.log('File being validated:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
    if (!isValidType) {
      console.log('Invalid file type:', file.type);
      message.error(ERROR_MESSAGES.FILE_TYPE);
      return false;
    }
    
    const isValidSize = file.size <= MAX_FILE_SIZE;
    if (!isValidSize) {
      console.log('Invalid file size:', file.size);
      message.error(ERROR_MESSAGES.FILE_SIZE);
      return false;
    }
    
    console.log('File validation passed');
    return false; // Prevent auto upload
  };

  const handleRemove = () => {
    console.log('Removing file');
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
        initialValues={initialValues}
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
          label="Nombre"
          rules={[{ required: true, message: ERROR_MESSAGES.REQUIRED_NAME }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descripción"
          rules={[{ required: true, message: ERROR_MESSAGES.REQUIRED_DESCRIPTION }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Precio"
          rules={[{ required: true, message: ERROR_MESSAGES.REQUIRED_PRICE }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value: string | undefined): 0 | number => value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0}
          />
        </Form.Item>

        <Form.Item
          label="Imagen"
          extra="Formatos permitidos: JPG, PNG. Tamaño máximo: 2MB"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            onRemove={handleRemove}
            accept="image/jpeg,image/png"
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Subir</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={submitting}
          >
            {initialValues ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductForm; 