import React, { ReactNode } from 'react'
import { Layout, Typography } from 'antd'
import styles from './FullWidthLayout.module.css'

const { Content, Footer } = Layout
const { Title } = Typography

interface FullWidthLayoutProps {
  children: ReactNode
  title?: string
}

const FullWidthLayout = ({ children, title }: FullWidthLayoutProps) => {
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        {title && <Title level={2} className={styles.title}>{title}</Title>}
        {children}
      </Content>
      <Footer className={styles.footer}>
        Gifty - Gift Voucher Platform ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default FullWidthLayout 