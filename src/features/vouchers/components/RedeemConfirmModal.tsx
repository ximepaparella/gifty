import React from 'react';
import { Modal, Typography, Space, Alert } from 'antd';
import { Voucher } from '../types';

const { Text } = Typography;

interface RedeemConfirmModalProps {
  voucher: Voucher;
  visible: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isRedeeming: boolean;
  error?: string;
}

const RedeemConfirmModal: React.FC<RedeemConfirmModalProps> = ({
  voucher,
  visible,
  onConfirm,
  onCancel,
  isRedeeming,
  error
}) => {
  return (
    <Modal
      title="Confirm Voucher Redemption"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Redeem"
      cancelText="Cancel"
      confirmLoading={isRedeeming}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
          />
        )}
        
        <div>
          <Text>Are you sure you want to redeem this voucher?</Text>
        </div>
        
        <div>
          <Text strong>Voucher Code: </Text>
          <Text>{voucher.code}</Text>
        </div>
        
        <div>
          <Text strong>Amount: </Text>
          <Text>${voucher.amount}</Text>
        </div>
        
        <div>
          <Text strong>Recipient: </Text>
          <Text>{voucher.receiverName} ({voucher.receiverEmail})</Text>
        </div>
        
        <div>
          <Text strong>Expiration: </Text>
          <Text>{new Date(voucher.expirationDate).toLocaleDateString()}</Text>
        </div>
      </Space>
    </Modal>
  );
};

export default RedeemConfirmModal; 