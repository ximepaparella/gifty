import { Customer } from '@/features/customer/types';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface PaymentDetails {
  paymentId: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentEmail: string;
  amount: number;
  provider: 'mercadopago' | 'paypal' | 'stripe';
}

export interface Voucher {
  storeId: string;
  productId: string;
  code: string;
  expirationDate: string | Date;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
  message: string;
  template: string;
  qrCode?: string;
}

export interface Order {
  _id?: string;
  id?: string;
  customerId: string;
  customer?: Customer;
  paymentDetails: PaymentDetails;
  voucher: Voucher;
  status: OrderStatus;
  emailsSent: boolean;
  pdfGenerated: boolean;
  pdfUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderFormData {
  customerId: string;
  paymentDetails: PaymentDetails;
  voucher: Voucher;
}

export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  submitting: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

export interface PaginatedOrdersResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 