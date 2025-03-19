import { Card, Table, Typography, Tag } from 'antd'
import { TopVouchers } from '@/mockups/dashboardData'

const { Text } = Typography

interface TopVouchersTableProps {
  data: TopVouchers[]
}

const TopVouchersTable = ({ data }: TopVouchersTableProps) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`
    },
    {
      title: 'Sold',
      dataIndex: 'soldCount',
      key: 'soldCount',
      render: (count: number) => (
        <Tag color="#108ee9">{count}</Tag>
      )
    },
    {
      title: 'Revenue',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (revenue: number) => (
        <Text strong type="success">${revenue.toFixed(2)}</Text>
      )
    }
  ]

  return (
    <Card 
      title="Top Selling Vouchers" 
      bordered={false}
      style={{ height: '100%' }}
    >
      <Table 
        columns={columns} 
        dataSource={data.map(item => ({ ...item, key: item.id }))} 
        pagination={false}
        size="middle"
      />
    </Card>
  )
}

export default TopVouchersTable 