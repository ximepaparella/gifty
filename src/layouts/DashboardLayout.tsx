import React, { ReactNode, useState, useMemo, useEffect } from 'react'
import { Layout, Menu, Button, Avatar, Typography, Dropdown, Space, Breadcrumb, Row, Col, Card } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  GiftOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import styles from './DashboardLayout.module.css'
import mainMenuItems from '@/config/menu/mainMenu'
import userMenuItems from '@/config/menu/userMenu'
import { convertToMenuItems, convertToUserMenuItems } from '@/config/menu/menuUtils'
import { RequireAuth } from '@/features/auth'
import { authService } from '@/features/auth/services/authService'
import Link from 'next/link'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

// Default user for fallback
const DEFAULT_USER = {
  name: 'Guest User',
  role: 'user'
}

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  requiredRoles?: string[]
}

const DashboardLayout = ({ children, title, requiredRoles }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const [userData, setUserData] = useState(DEFAULT_USER)
  
  // Load user data on mount
  useEffect(() => {
    const session = authService.getSession()
    if (session && session.user) {
      setUserData(session.user)
    }
  }, [])

  const handleSignOut = () => {
    authService.logout()
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
  }, [router])

  // Generate menu items based on user role
  const menuItems = useMemo(() => 
    convertToMenuItems(mainMenuItems, mainMenuHandlers, userData?.role),
    [mainMenuHandlers, userData?.role]
  )

  // Generate user dropdown menu items
  const dropdownItems = useMemo(() => 
    convertToUserMenuItems(userMenuItems, userMenuHandlers),
    [userMenuHandlers]
  )

  return (
    <RequireAuth allowedRoles={requiredRoles}>
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
                  <Text className={styles.userName}>{userData?.name}</Text>
                </Space>
              </Dropdown>
            </div>
          </Header>
          <Content className={styles.content}>
          <Row>  
            <Col span={24}>
                <Breadcrumb className={styles.breadcrumb}>
                  <Breadcrumb.Item>
                    <Link href="/dashboard">Dashboard</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    {title}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
           {title && <Title level={2} className={styles.pageTitle}>{title}</Title>}
            {children}
          </Content>
        </Layout>
      </Layout>
    </RequireAuth>
  )
}

export default DashboardLayout 