import React, { useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Card, Spin } from 'antd'
import DashboardLayout from '@/layouts/DashboardLayout'
import VoucherForm from '@/features/vouchers/components/VoucherForm'
import { useVouchers } from '@/features/vouchers/hooks/useVouchers'

const EditVoucherPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const { 
    selectedVoucher, 
    loading, 
    submitting, 
    fetchVoucherById, 
    handleUpdateVoucher 
  } = useVouchers()

  // Use useCallback to prevent infinite dependency cycle
  const fetchVoucher = useCallback(() => {
    if (id && typeof id === 'string') {
      console.log("Fetching voucher with ID:", id);
      fetchVoucherById(id);
    }
  }, [id, fetchVoucherById]);

  // Fetch voucher data when component mounts or id changes
  useEffect(() => {
    fetchVoucher();
  }, [fetchVoucher]);

  const handleSubmit = (values: any) => {
    if (id && typeof id === 'string') {
      handleUpdateVoucher(id, values)
    }
  }

  console.log("Edit page - Voucher ID:", id);
  console.log("Edit page - Selected voucher:", selectedVoucher);
  console.log("Edit page - Loading state:", loading);

  if (loading) {
    return (
      <DashboardLayout title="Edit Voucher">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" tip="Loading voucher..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Edit Voucher | Gifty Dashboard</title>
      </Head>
      <DashboardLayout title="Edit Voucher">
        <Card title="Edit Voucher">
          {selectedVoucher ? (
            <VoucherForm
              initialValues={selectedVoucher}
              onSubmit={handleSubmit}
              loading={submitting}
            />
          ) : (
            <div>No voucher found with ID: {id}</div>
          )}
        </Card>
      </DashboardLayout>
    </>
  )
}

export default EditVoucherPage 