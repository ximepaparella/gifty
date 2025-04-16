export interface Customer {
  _id: string;
  userId: string | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CustomerFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface CustomersResponse {
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 