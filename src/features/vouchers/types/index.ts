export interface Voucher {
  _id?: string  // MongoDB format
  id?: string   // API response format
  storeId: string
  productId: string
  customerId?: string
  amount: number
  code: string
  status: 'active' | 'redeemed' | 'expired'
  isRedeemed: boolean
  expirationDate: string
  qrCode: string
  senderName: string
  senderEmail: string
  receiverName: string
  receiverEmail: string
  message: string
  template: string
  redeemedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface VoucherFormData {
  storeId: string
  productId: string
  customerId?: string
  amount: number
  expirationDate: Date | string
  senderName: string
  senderEmail: string
  receiverName: string
  receiverEmail: string
  message: string
  template: string
  status?: 'active' | 'redeemed' | 'expired'
}

export interface VouchersResponse {
  data: Voucher[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface VouchersState {
  vouchers: Voucher[]
  selectedVoucher: Voucher | null
  loading: boolean
  submitting: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
} 