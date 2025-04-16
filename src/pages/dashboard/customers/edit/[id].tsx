import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Spin } from 'antd'
import DashboardLayout from '@/layouts/DashboardLayout'
import CustomerForm from '@/features/customers/components/CustomerForm'
import { useCustomers } from '@/features/customers/hooks/useCustomers'

const EditCustomerPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  
  const { 
    selectedCustomer, 
    loading, 
    submitting, 
    fetchCustomerById, 
    handleUpdateCustomer 
  } = useCustomers()

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchCustomerById(id)
    }
  }, [id, fetchCustomerById])

  const handleSubmit = async (values: any) => {
    if (id && typeof id === 'string') {
      handleUpdateCustomer(id, values)
    }
  }

  if (loading || !selectedCustomer) {
    return (
      <DashboardLayout title="Edit Customer">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading customer details...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Edit Customer">
      <Head>
        <title>Edit Customer | Gifty Dashboard</title>
      </Head>

      <CustomerForm 
        initialValues={selectedCustomer} 
        onSubmit={handleSubmit} 
        isLoading={submitting} 
      />
    </DashboardLayout>
  )
}

export default EditCustomerPage 