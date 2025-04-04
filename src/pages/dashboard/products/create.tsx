import React from 'react'
import Head from 'next/head'
import { Card } from 'antd'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProductForm from '@/features/products/components/ProductForm'
import { useProducts } from '@/features/product/hooks/useProducts'

const CreateProductPage = () => {
  const { handleCreateProduct, submitting } = useProducts()

  return (
    <>
      <Head>
        <title>Crear Producto | Gifty Dashboard</title>
      </Head>
      <DashboardLayout>
          <ProductForm
            onSubmit={handleCreateProduct}
            loading={submitting}
          />
      </DashboardLayout>
    </>
  )
}

export default CreateProductPage 