export interface PaymentDetails {
  paymentId: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentEmail: string;
  amount: number;
  provider: 'mercadopago' | 'paypal' | 'stripe';
  createdAt: string;
  updatedAt: string;
}

export interface VoucherDetails {
  storeId: string;
  productId: string;
  code: string;
  status: 'active' | 'redeemed' | 'expired';
  isRedeemed: boolean;
  redeemedAt: string | null;
  expirationDate: string;
  qrCode?: string;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
  message: string;
  template: string;
}

export interface Order {
  id?: string;
  _id?: string;
  customerId: string;
  paymentDetails: PaymentDetails;
  voucher: VoucherDetails;
  emailsSent: boolean;
  pdfGenerated: boolean;
  pdfUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderFormData {
  customerId: string;
  paymentDetails: {
    paymentId: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentEmail: string;
    amount: number;
    provider: 'mercadopago' | 'paypal' | 'stripe';
  };
  voucher: {
    storeId: string;
    productId: string;
    expirationDate: string;
    senderName: string;
    senderEmail: string;
    receiverName: string;
    receiverEmail: string;
    message: string;
    template: string;
  };
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