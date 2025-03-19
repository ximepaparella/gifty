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
  },
  {
    key: 'vouchers',
    icon: 'GiftOutlined',
    label: 'Gift Vouchers',
    path: '/dashboard/vouchers',
  },
  {
    key: 'orders',
    icon: 'ShoppingCartOutlined',
    label: 'Orders',
    path: '/dashboard/orders',
  },
  {
    key: 'stores',
    icon: 'ShopOutlined',
    label: 'Stores',
    path: '/dashboard/stores',
  },
  {
    key: 'users',
    icon: 'UserOutlined',
    label: 'Users',
    path: '/dashboard/users',
    permissions: ['admin'], // Only admin can see this
  },
];

export default mainMenuItems; 