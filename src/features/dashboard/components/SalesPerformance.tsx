import { Card, Typography, Progress } from 'antd'
import { SalesPerformance as SalesPerformanceType } from '@/mockups/dashboardData'

const { Title, Text } = Typography

interface SalesPerformanceProps {
  data: SalesPerformanceType
}

const SalesPerformance = ({ data }: SalesPerformanceProps) => {
  const formattedCurrent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(data.current)

  const formattedTarget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(data.target)

  // Determine color based on percentage
  const getColor = (percent: number) => {
    if (percent < 30) return '#f5222d'; // Red
    if (percent < 70) return '#faad14'; // Yellow
    return '#52c41a'; // Green
  };

  return (
    <Card 
      title="Sales Performance" 
      bordered={false}
      style={{ height: '100%' }}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Progress
          type="circle"
          percent={data.percentage}
          strokeColor={getColor(data.percentage)}
          width={180}
          format={percent => `${percent}%`}
        />
        <div style={{ marginTop: 24 }}>
          <Text>Current</Text>
          <Title level={3} style={{ margin: '8px 0' }}>{formattedCurrent}</Title>
          <Text type="secondary">Target: {formattedTarget}</Text>
        </div>
      </div>
    </Card>
  )
}

export default SalesPerformance 