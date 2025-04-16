import React from 'react'
import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import CustomerForm from '@/features/customers/components/CustomerForm'
import { useCustomers } from '@/features/customers/hooks/useCustomers'

const CreateCustomerPage: React.FC = () => {
  const { handleCreateCustomer, submitting } = useCustomers()

  return (
    <>
      <Head>
        <title>Create Customer | Gifty Dashboard</title>
      </Head>
      <DashboardLayout title="Create Customer">
        <CustomerForm
          onSubmit={handleCreateCustomer}
          isLoading={submitting}
        />
      </DashboardLayout>
    </>
  )
}

export default CreateCustomerPage 