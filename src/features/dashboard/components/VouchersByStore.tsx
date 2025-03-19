import { Card } from 'antd'
import { Bar } from '@ant-design/charts'
import { VouchersByStore as VouchersByStoreType } from '@/mockups/dashboardData'

interface VouchersByStoreProps {
  data: VouchersByStoreType[]
}

const VouchersByStore = ({ data }: VouchersByStoreProps) => {
  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  const config = {
    data: sortedData,
    xField: 'value',
    yField: 'store',
    seriesField: 'store',
    legend: { position: 'top-left' as const },
    color: ['#7367F0', '#28C76F', '#FF9F43', '#00CFE8', '#EA5455'],
    barBackground: { style: { fill: 'rgba(0,0,0,0.05)' } },
    interactions: [{ type: 'active-region', enable: false }],
    label: {
      position: 'right',
      content: (item: any) => `${item.value} (${item.percentage}%)`,
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.store, value: `${datum.value} (${datum.percentage}%)` }
      }
    }
  }

  return (
    <Card 
      title="Vouchers by Store" 
      bordered={false}
      style={{ height: '100%' }}
    >
      <Bar {...config} height={300} />
    </Card>
  )
}

export default VouchersByStore 