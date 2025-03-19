import { Row, Col } from 'antd'
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

// Get data synchronously
const dashboardData = fetchDashboardData()

export default function Dashboard() {
  // Since data is loaded statically, no need for loading state or useEffect
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
