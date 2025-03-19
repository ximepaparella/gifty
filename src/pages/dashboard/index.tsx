import { useEffect, useState } from 'react'
import { Row, Col, Spin } from 'antd'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import SummaryCards from '@/features/dashboard/components/SummaryCards'
import SalesPerformance from '@/features/dashboard/components/SalesPerformance'
import SalesChart from '@/features/dashboard/components/SalesChart'
import TopVouchersTable from '@/features/dashboard/components/TopVouchersTable'
import RecentOrdersTable from '@/features/dashboard/components/RecentOrdersTable'
import RevenueByChannel from '@/features/dashboard/components/RevenueByChannel'
import VouchersByStore from '@/features/dashboard/components/VouchersByStore'
import { fetchDashboardData } from '@/features/dashboard/services/dashboardService'
import { DashboardData } from '@/mockups/dashboardData'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    const loadDashboardData = async () => {
      if (status === 'authenticated') {
        try {
          setLoading(true)
          const data = await fetchDashboardData()
          setDashboardData(data)
        } catch (error) {
          console.error('Failed to load dashboard data:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadDashboardData()
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Spin size="large" tip="Loading dashboard..." />
        </div>
      </DashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div>Failed to load dashboard data</div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard | Gifty Platform</title>
      </Head>
      <DashboardLayout title="Dashboard">
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <SummaryCards data={dashboardData.salesSummary} />
          </Col>

          <Col lg={16} xs={24}>
            <SalesChart data={dashboardData.monthlyData} />
          </Col>
          <Col lg={8} xs={24}>
            <SalesPerformance data={dashboardData.salesPerformance} />
          </Col>

          <Col lg={12} xs={24}>
            <RevenueByChannel data={dashboardData.revenueBySalesChannel} />
          </Col>
          <Col lg={12} xs={24}>
            <VouchersByStore data={dashboardData.vouchersByStore} />
          </Col>

          <Col lg={12} xs={24}>
            <TopVouchersTable data={dashboardData.topVouchers} />
          </Col>
          <Col lg={12} xs={24}>
            <RecentOrdersTable data={dashboardData.recentOrders} />
          </Col>
        </Row>
      </DashboardLayout>
    </>
  )
}
