import React from 'react';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  UserOutlined,
  GiftOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { MenuItemConfig } from './mainMenu';
import { UserMenuItemConfig } from './userMenu';
import { ItemType } from 'antd/es/menu/hooks/useItems';

// Map of icon name to icon component
const iconMap: { [key: string]: React.ReactNode } = {
  DashboardOutlined: <DashboardOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  ShopOutlined: <ShopOutlined />,
  UserOutlined: <UserOutlined />,
  GiftOutlined: <GiftOutlined />,
  LogoutOutlined: <LogoutOutlined />,
  SettingOutlined: <SettingOutlined />,
};

// Convert menu configuration to Ant Design menu items
export const convertToMenuItems = (
  menuConfig: MenuItemConfig[],
  onClickHandlers: { [key: string]: (item: MenuItemConfig) => void } = {},
  userRole?: string
): ItemType[] => {
  return menuConfig
    .filter(item => !item.permissions || (userRole && item.permissions.includes(userRole)))
    .map(item => ({
      key: item.key,
      icon: iconMap[item.icon],
      label: item.label,
      onClick: () => onClickHandlers[item.key] && onClickHandlers[item.key](item),
      children: item.children ? convertToMenuItems(item.children, onClickHandlers, userRole) : undefined,
    }));
};

// Convert user menu configuration to Ant Design dropdown items
export const convertToUserMenuItems = (
  menuConfig: UserMenuItemConfig[],
  handlers: { [key: string]: () => void } = {}
) => {
  return menuConfig.map(item => ({
    key: item.key,
    icon: iconMap[item.icon],
    label: item.label,
    onClick: handlers[item.key],
  }));
}; 