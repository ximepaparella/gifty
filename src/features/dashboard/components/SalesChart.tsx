import { Card } from 'antd'
import { Column } from '@ant-design/charts'
import { SalesData } from '@/mockups/dashboardData'

interface SalesChartProps {
  data: SalesData[]
}

const SalesChart = ({ data }: SalesChartProps) => {
  // Transform the data for the chart
  const chartData = data.flatMap(item => [
    { month: item.month, value: item.vouchers, type: 'Vouchers' },
    { month: item.month, value: item.orders, type: 'Orders' }
  ])

  const config = {
    data: chartData,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    color: ['#7367F0', '#28C76F'],
    columnStyle: {
      radius: [4, 4, 0, 0]
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false
      }
    },
    meta: {
      month: { alias: 'Month' },
      value: { alias: 'Count' }
    }
  }

  return (
    <Card title="Monthly Sales Activity" bordered={false} style={{ height: '100%' }}>
      <Column {...config} height={300} />
    </Card>
  )
}

export default SalesChart 