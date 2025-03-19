import { Card, Table, Tag } from 'antd'
import { RecentOrder } from '@/mockups/dashboardData'

interface RecentOrdersTableProps {
  data: RecentOrder[]
}

const RecentOrdersTable = ({ data }: RecentOrdersTableProps) => {
  // Status tag colors
  const statusColors = {
    processing: 'blue',
    completed: 'green',
    refunded: 'orange',
    cancelled: 'red'
  }

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = statusColors[status as keyof typeof statusColors]
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
    }
  ]

  return (
    <Card 
      title="Recent Orders" 
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

export default RecentOrdersTable 