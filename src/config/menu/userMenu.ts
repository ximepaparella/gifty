export interface UserMenuItemConfig {
  key: string;
  icon: string;
  label: string;
  action?: string; // action type: 'link', 'function'
  path?: string;
}

// User dropdown menu configuration
const userMenuItems: UserMenuItemConfig[] = [
  {
    key: 'profile',
    icon: 'UserOutlined',
    label: 'Profile',
    action: 'link',
    path: '/dashboard/profile',
  },
  {
    key: 'settings',
    icon: 'SettingOutlined',
    label: 'Settings',
    action: 'link',
    path: '/dashboard/settings',
  },
  {
    key: 'logout',
    icon: 'LogoutOutlined',
    label: 'Logout',
    action: 'function',
  },
];

export default userMenuItems; 