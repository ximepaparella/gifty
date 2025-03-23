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
    permissions: ['admin'], // Only admin can see this
  },
  {
    key: 'products',
    icon: 'GiftOutlined',
    label: 'Productos',
    path: '/dashboard/products',
    permissions: ['admin'], // Only admin can see this
  },
  {
    key: 'vouchers',
    icon: 'GiftOutlined',
    label: 'Gift Vouchers',
    path: '/dashboard/vouchers',
    permissions: ['admin'], // Only admin can see this
  },
  {
    key: 'redeem',
    icon: 'CheckCircleOutlined',
    label: 'Redeem Voucher',
    path: '/dashboard/vouchers/redeem',
    permissions: ['admin', 'customer'], // Both admin and customers can redeem
  },
  {
    key: 'orders',
    icon: 'ShoppingCartOutlined',
    label: 'Orders',
    path: '/dashboard/orders',
    permissions: ['admin'], // Only admin can see this
  },
  {
    key: 'stores',
    icon: 'ShopOutlined',
    label: 'Stores',
    path: '/dashboard/stores',
    permissions: ['admin'], // Only admin can see this
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