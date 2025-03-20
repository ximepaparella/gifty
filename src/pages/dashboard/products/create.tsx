import React from 'react'
import Head from 'next/head'
import { Card, Typography } from 'antd'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProductForm from '@/features/product/components/ProductForm'
import { useProducts } from '@/features/product/hooks/useProducts'

const { Title } = Typography

const CreateProductPage = () => {
  const { handleCreateProduct, submitting } = useProducts()

  return (
    <>
      <Head>
        <title>Create Product | Gifty Dashboard</title>
      </Head>
      <DashboardLayout>
        <Card title="Create Product">
          <ProductForm
            onSubmit={handleCreateProduct}
            loading={submitting}
          />
        </Card>
      </DashboardLayout>
    </>
  )
}

export default CreateProductPage 