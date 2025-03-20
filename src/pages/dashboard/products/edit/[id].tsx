import React, { useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Card, Typography, Spin } from 'antd'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProductForm from '@/features/product/components/ProductForm'
import { useProducts } from '@/features/product/hooks/useProducts'

const { Title } = Typography

const EditProductPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { 
    selectedProduct, 
    loading, 
    submitting, 
    fetchProductById, 
    handleUpdateProduct 
  } = useProducts()

  // Use useCallback to prevent infinite dependency cycle
  const fetchProduct = useCallback(() => {
    if (id && typeof id === 'string') {
      console.log("Fetching product with ID:", id);
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // Fetch product data when component mounts or id changes
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleSubmit = (values: any) => {
    if (id && typeof id === 'string') {
      handleUpdateProduct(id, values)
    }
  }

  console.log("Edit page - Product ID:", id);
  console.log("Edit page - Selected product:", selectedProduct);
  console.log("Edit page - Loading state:", loading);

  if (loading) {
    return (
      <DashboardLayout title="Edit Product">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" tip="Loading product..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Edit Product | Gifty Dashboard</title>
      </Head>
      <DashboardLayout title="Edit Product">
        <Card title="Edit Product">
          {selectedProduct ? (
            <ProductForm
              initialValues={selectedProduct}
              onSubmit={handleSubmit}
              loading={submitting}
            />
          ) : (
            <div>No product found with ID: {id}</div>
          )}
        </Card>
      </DashboardLayout>
    </>
  )
}

export default EditProductPage 