export interface SocialLink {
  name: string;
  url: string;
}

export interface StoreSocial {
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
  others: SocialLink[];
}

export interface Store {
  _id?: string;
  id?: string;
  name: string;
  ownerId: string;
  email: string;
  phone: string;
  address: string;
  logo: string | null;
  social: StoreSocial;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  ownerId: string;
  logo?: File | null;
  social: StoreSocial;
}

export interface StoresState {
  stores: Store[];
  selectedStore: Store | null;
  loading: boolean;
  submitting: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface StoresResponse {
  data: Store[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 