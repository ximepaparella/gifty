import { Card } from 'antd'
import { Pie } from '@ant-design/charts'
import { RevenueBySalesChannel } from '@/mockups/dashboardData'

interface RevenueByChannelProps {
  data: RevenueBySalesChannel[]
}

const RevenueByChannel = ({ data }: RevenueByChannelProps) => {
  // Format the data for the pie chart
  const chartData = data.map(item => ({
    type: item.channel,
    value: item.value
  }))

  const config = {
    appendPadding: 10,
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.5,
    interactions: [{ type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '16px'
        },
        content: 'Sales\nChannels',
      },
    },
    legend: {
      layout: 'horizontal',
      position: 'bottom'
    },
    tooltip: {
      formatter: (datum: any) => {
        const item = data.find(i => i.channel === datum.type)
        return { 
          name: datum.type, 
          value: `$${datum.value.toFixed(2)} (${item?.percentage}%)` 
        }
      }
    }
  }

  return (
    <Card 
      title="Revenue by Sales Channel" 
      bordered={false}
      style={{ height: '100%' }}
    >
      <Pie {...config} height={300} />
    </Card>
  )
}

export default RevenueByChannel 