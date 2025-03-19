import React, { ReactNode, useState, useMemo } from 'react'
import { Layout, Menu, Button, Avatar, Typography, Dropdown, Space } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  GiftOutlined,
} from '@ant-design/icons'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import styles from './DashboardLayout.module.css'
import mainMenuItems from '@/config/menu/mainMenu'
import userMenuItems from '@/config/menu/userMenu'
import { convertToMenuItems, convertToUserMenuItems } from '@/config/menu/menuUtils'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/auth/login')
  }

  // Menu click handlers
  const mainMenuHandlers = useMemo(() => {
    return mainMenuItems.reduce((acc, item) => {
      acc[item.key] = () => router.push(item.path)
      return acc
    }, {} as Record<string, () => void>)
  }, [router])

  // User menu handlers
  const userMenuHandlers = useMemo(() => {
    return {
      profile: () => router.push('/dashboard/profile'),
      settings: () => router.push('/dashboard/settings'),
      logout: handleSignOut
    }
  }, [router, handleSignOut])

  // Generate menu items based on user role
  const menuItems = useMemo(() => 
    convertToMenuItems(mainMenuItems, mainMenuHandlers, session?.user?.role),
    [mainMenuHandlers, session?.user?.role]
  )

  // Generate user dropdown menu items
  const dropdownItems = useMemo(() => 
    convertToUserMenuItems(userMenuItems, userMenuHandlers),
    [userMenuHandlers]
  )

  return (
    <Layout className={styles.layout}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className={styles.sider}
        width={250}
      >
        <div className={styles.logo}>
          {!collapsed && <Title level={3} className={styles.logoText}>Gifty Platform</Title>}
          {collapsed && <GiftOutlined className={styles.logoIcon} />}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[router.pathname === '/dashboard' ? 'dashboard' : router.pathname.split('/')[2] || '']}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.trigger}
          />
          <div className={styles.headerRight}>
            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
              <Space className={styles.userInfo}>
                <Avatar icon={<UserOutlined />} />
                {session?.user?.name && <Text className={styles.userName}>{session.user.name}</Text>}
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          {title && <Title level={2} className={styles.pageTitle}>{title}</Title>}
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout 