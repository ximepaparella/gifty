import React from 'react'
import Head from 'next/head'
import { Card } from 'antd'
import DashboardLayout from '@/layouts/DashboardLayout'
import VoucherForm from '@/features/vouchers/components/VoucherForm'
import { useVouchers } from '@/features/vouchers/hooks/useVouchers'

const CreateVoucherPage: React.FC = () => {
  const { handleCreateVoucher, submitting } = useVouchers()

  return (
    <>
      <Head>
        <title>Create Voucher | Gifty Dashboard</title>
      </Head>
      <DashboardLayout title="Create Voucher">
        <Card title="Create Voucher">
          <VoucherForm
            onSubmit={handleCreateVoucher}
            loading={submitting}
          />
        </Card>
      </DashboardLayout>
    </>
  )
}

export default CreateVoucherPage 