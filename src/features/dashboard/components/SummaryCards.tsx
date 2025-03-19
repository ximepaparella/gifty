import { Row, Col, Card, Statistic } from 'antd'
import { DollarOutlined, ShoppingOutlined, UserOutlined, GiftOutlined } from '@ant-design/icons'
import { SalesSummary } from '@/mockups/dashboardData'

interface SummaryCardsProps {
  data: SalesSummary
}

const SummaryCards = ({ data }: SummaryCardsProps) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false}>
          <Statistic
            title="Total Sales"
            value={data.totalSales}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<DollarOutlined />}
            suffix="USD"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false}>
          <Statistic
            title="Total Orders"
            value={data.totalOrders}
            valueStyle={{ color: '#1890ff' }}
            prefix={<ShoppingOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false}>
          <Statistic
            title="Total Customers"
            value={data.totalCustomers}
            valueStyle={{ color: '#722ed1' }}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false}>
          <Statistic
            title="Total Vouchers"
            value={data.totalVouchers}
            valueStyle={{ color: '#fa8c16' }}
            prefix={<GiftOutlined />}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default SummaryCards 