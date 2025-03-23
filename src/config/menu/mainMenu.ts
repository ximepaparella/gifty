import { MenuProps } from 'antd'

export interface MenuItemConfig {
  key: string;
  icon: string; // Use string identifiers for icons
  label: string;
  path: string;
  children?: MenuItemConfig[];
  permissions?: string[];
}

// Main menu configuration
const mainMenuItems: MenuItemConfig[] = [
  {
    key: 'dashboard',
    icon: 'DashboardOutlined',
    label: 'Dashboard',
    path: '/dashboard',
    permissions: ['admin', "store_manager"], 
  },
  {
    key: 'products',
    icon: 'GiftOutlined',
    label: 'Products & Services',
    path: '/dashboard/products',
    permissions: ['admin', "store_manager"], 
  },
  {
    key: 'redeem',
    icon: 'ReloadOutlined',
    label: 'Redeem Voucher',
    path: '/dashboard/vouchers/redeem',
    permissions: ['admin', 'store_manager', 'customer'], // Both admin and customers can redeem
  },
  {
    key: 'orders',
    icon: 'ShoppingCartOutlined',
    label: 'Orders',
    path: '/dashboard/orders',
    permissions: ['admin', "store_manager"], 
  },
  {
    key: 'stores',
    icon: 'ShopOutlined',
    label: 'Stores',
    path: '/dashboard/stores',
    permissions: ['admin', "store_manager"], 
  },
  {
    key: 'users',
    icon: 'UserOutlined',
    label: 'Users',
    path: '/dashboard/users',
    permissions: ['admin'], 
  },
  {
    key: 'customers',
    icon: 'UserOutlined',
    label: 'Customers',
    path: '/dashboard/customers',
    permissions: ['admin', "store_manager"], 
  },
  {
    key: 'settings',
    icon: 'SettingOutlined',
    label: 'Settings',
    path: '/dashboard/settings',
    permissions: ['admin', "store_manager"], 
  },
  {
    key: 'reports',
    icon: 'PieChartOutlined',
    label: 'Reports',
    path: '/dashboard/reports',
    permissions: ['admin', "store_manager"], 
  }
];

export default mainMenuItems; 