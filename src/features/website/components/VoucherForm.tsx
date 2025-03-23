import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Typography } from 'antd';
import { ExportOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Template1, Template2, Template3, Template4, Template5 } from './templates';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

export interface VoucherData {
  sender_name: string;
  sender_email: string;
  receiver_name: string;
  receiver_email: string;
  message: string;
  template: string;
  productName: string;
  storeName: string;
  storeAddress: string;
  storeEmail: string;
  storePhone: string;
  storeSocial: string;
  storeLogo: string;
  expirationDate: string;
  code: string;
  qrCode: string;
}

interface VoucherFormProps {
  productName: string;
  storeName: string;
}

const VoucherForm: React.FC<VoucherFormProps> = ({ productName, storeName }) => {
  const [voucherData, setVoucherData] = useState<VoucherData>({
    sender_name: '',
    sender_email: '',
    receiver_name: '',
    receiver_email: '',
    message: '',
    template: '1',
    productName,
    storeName,
    storeAddress: '123 Main St, Anytown, USA',
    storeEmail: 'contact@example.com',
    storePhone: '(555) 123-4567',
    storeSocial: '@store_social',
    storeLogo: '/placeholder.svg',
    expirationDate: '12/31/2024',
    code: 'GIFT123456',
    qrCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVoucherData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateChange = (value: string) => {
    setVoucherData(prev => ({
      ...prev,
      template: value
    }));
  };

  const renderTemplatePreview = () => {
    const commonProps = {
      ...voucherData
    };

    switch (voucherData.template) {
      case '1':
        return <Template1 {...commonProps} />;
      case '2':
        return <Template2 {...commonProps} />;
      case '3':
        return <Template3 {...commonProps} />;
      case '4':
        return <Template4 {...commonProps} />;
      case '5':
        return <Template5 {...commonProps} />;
      default:
        return <Template1 {...commonProps} />;
    }
  };

  return (
    <div className="tw-mt-8 tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-8">
      <div className="tw-space-y-6">
        <div>
          <h3 className="tw-text-xl tw-font-medium tw-mb-4">Personalize Your Gift</h3>
          
          <div className="tw-space-y-4">
            <div>
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1.5">
                <UserOutlined className="tw-text-gifty-500" />
                <Text>From (Your Name)</Text>
              </div>
              <Input 
                name="sender_name"
                value={voucherData.sender_name}
                onChange={handleInputChange}
                placeholder="Your name"
              />
            </div>
            
            <div>
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1.5">
                <MailOutlined className="tw-text-gifty-500" />
                <Text>Your Email</Text>
              </div>
              <Input 
                name="sender_email"
                value={voucherData.sender_email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                type="email"
              />
            </div>
            
            <div>
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1.5">
                <UserOutlined className="tw-text-gifty-500" />
                <Text>To (Recipient's Name)</Text>
              </div>
              <Input 
                name="receiver_name"
                value={voucherData.receiver_name}
                onChange={handleInputChange}
                placeholder="Recipient's name"
              />
            </div>
            
            <div>
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1.5">
                <MailOutlined className="tw-text-gifty-500" />
                <Text>Recipient's Email</Text>
              </div>
              <Input 
                name="receiver_email"
                value={voucherData.receiver_email}
                onChange={handleInputChange}
                placeholder="recipient.email@example.com"
                type="email"
              />
            </div>
            
            <div>
              <div className="tw-mb-1.5">
                <Text>Personal Message</Text>
              </div>
              <TextArea 
                name="message"
                value={voucherData.message}
                onChange={handleInputChange}
                placeholder="Add a personal message for the recipient..."
                rows={4}
              />
            </div>
            
            <div>
              <div className="tw-mb-1.5">
                <Text>Template Style</Text>
              </div>
              <Select 
                value={voucherData.template} 
                onChange={handleTemplateChange}
                style={{ width: '100%' }}
              >
                <Option value="1">Classic Black</Option>
                <Option value="2">Purple Elegance</Option>
                <Option value="3">Gradient Purple</Option>
                <Option value="4">Golden Luxury</Option>
                <Option value="5">Blue Modern</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-4 tw-border">
        <h3 className="tw-text-xl tw-font-medium tw-mb-4">Voucher Preview</h3>
        <div className="tw-mt-4 tw-rounded-lg tw-border tw-overflow-hidden">
          {renderTemplatePreview()}
        </div>
      </div>
    </div>
  );
};

export default VoucherForm;
