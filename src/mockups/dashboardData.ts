export interface SalesSummary {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalVouchers: number;
}

export interface SalesPerformance {
  target: number;
  current: number;
  percentage: number;
}

export interface SalesData {
  month: string;
  vouchers: number;
  orders: number;
}

export interface TopVouchers {
  id: string;
  name: string;
  price: number;
  soldCount: number;
  totalRevenue: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'processing' | 'completed' | 'refunded' | 'cancelled';
}

export interface RevenueBySalesChannel {
  channel: string;
  value: number;
  percentage: number;
}

export interface VouchersByStore {
  store: string;
  value: number;
  percentage: number;
}

export interface DashboardData {
  salesSummary: SalesSummary;
  salesPerformance: SalesPerformance;
  monthlyData: SalesData[];
  topVouchers: TopVouchers[];
  recentOrders: RecentOrder[];
  revenueBySalesChannel: RevenueBySalesChannel[];
  vouchersByStore: VouchersByStore[];
}

const dashboardData: DashboardData = {
  salesSummary: {
    totalSales: 58435.2,
    totalOrders: 482,
    totalCustomers: 345,
    totalVouchers: 542
  },
  salesPerformance: {
    target: 75000,
    current: 58435.2,
    percentage: 77.9
  },
  monthlyData: [
    { month: 'Jan', vouchers: 45, orders: 32 },
    { month: 'Feb', vouchers: 52, orders: 38 },
    { month: 'Mar', vouchers: 61, orders: 45 },
    { month: 'Apr', vouchers: 55, orders: 40 },
    { month: 'May', vouchers: 78, orders: 52 },
    { month: 'Jun', vouchers: 82, orders: 58 },
    { month: 'Jul', vouchers: 91, orders: 61 },
    { month: 'Aug', vouchers: 78, orders: 53 }
  ],
  topVouchers: [
    {
      id: 'GV001',
      name: 'Deluxe Dinner Experience',
      price: 150,
      soldCount: 86,
      totalRevenue: 12900
    },
    {
      id: 'GV002',
      name: 'Spa Day Package',
      price: 120,
      soldCount: 72,
      totalRevenue: 8640
    },
    {
      id: 'GV003',
      name: 'Adventure Weekend',
      price: 220,
      soldCount: 58,
      totalRevenue: 12760
    },
    {
      id: 'GV004',
      name: 'Wine Tasting Tour',
      price: 85,
      soldCount: 95,
      totalRevenue: 8075
    },
    {
      id: 'GV005',
      name: 'Photography Session',
      price: 180,
      soldCount: 43,
      totalRevenue: 7740
    }
  ],
  recentOrders: [
    {
      id: 'ORD-9385',
      customer: 'John Smith',
      date: '2023-08-23',
      amount: 220,
      status: 'completed'
    },
    {
      id: 'ORD-9384',
      customer: 'Emma Johnson',
      date: '2023-08-22',
      amount: 120,
      status: 'processing'
    },
    {
      id: 'ORD-9383',
      customer: 'Michael Brown',
      date: '2023-08-22',
      amount: 150,
      status: 'completed'
    },
    {
      id: 'ORD-9382',
      customer: 'Olivia Davis',
      date: '2023-08-21',
      amount: 85,
      status: 'completed'
    },
    {
      id: 'ORD-9381',
      customer: 'William Wilson',
      date: '2023-08-21',
      amount: 180,
      status: 'refunded'
    },
    {
      id: 'ORD-9380',
      customer: 'Sophia Martinez',
      date: '2023-08-20',
      amount: 150,
      status: 'completed'
    },
    {
      id: 'ORD-9379',
      customer: 'James Taylor',
      date: '2023-08-20',
      amount: 120,
      status: 'cancelled'
    }
  ],
  revenueBySalesChannel: [
    {
      channel: 'Website',
      value: 32140.5,
      percentage: 55
    },
    {
      channel: 'Mobile App',
      value: 17530.56,
      percentage: 30
    },
    {
      channel: 'In-store',
      value: 8764.14,
      percentage: 15
    }
  ],
  vouchersByStore: [
    {
      store: 'Fine Dining Restaurant',
      value: 185,
      percentage: 34
    },
    {
      store: 'Luxury Spa',
      value: 142,
      percentage: 26
    },
    {
      store: 'Adventure Tours',
      value: 98,
      percentage: 18
    },
    {
      store: 'Wine Vineyard',
      value: 75,
      percentage: 14
    },
    {
      store: 'Photography Studio',
      value: 42,
      percentage: 8
    }
  ]
};

export default dashboardData; 