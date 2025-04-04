import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Spin, Alert } from 'antd'
import DashboardLayout from '@/layouts/DashboardLayout'
import StoreForm from '@/features/stores/components/StoreForm'
import { useStores } from '@/features/stores/hooks/useStores'

const EditStorePage = () => {
  const { selectedStore, loading, submitting, fetchStoreById, handleUpdateStore } = useStores()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady) return
    
    const { id } = router.query
    
    if (!id) {
      setError('No se ha proporcionado un ID de tienda en la URL')
      return
    }
    
    // Clear any previous errors
    setError(null)
    
    // Fetch store data (log for debugging)
    console.log("Fetching store with ID:", id)
    fetchStoreById(id as string)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query])

  if (error) {
    return (
      <DashboardLayout title="Editar tienda">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <a onClick={() => router.push('/dashboard/stores')}>
              Volver a la lista de tiendas
            </a>
          }
        />
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout title="Editar tienda">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" tip="Cargando información de la tienda..." />
        </div>
      </DashboardLayout>
    )
  }

  if (!selectedStore) {
    return (
      <DashboardLayout title="Editar tienda">
        <Alert
          message="Tienda no encontrada"
          description="No se pudo encontrar la tienda especificada. Por favor, inténtelo de nuevo o seleccione una tienda diferente."
          type="warning"
          showIcon
          action={
            <a onClick={() => router.push('/dashboard/stores')}>
              Volver a la lista de tiendas
            </a>
          }
        />
      </DashboardLayout>
    )
  }

  const handleSubmit = async (values: any) => {
    const { id } = router.query
    if (!id) {
      return Promise.reject('No se pudo encontrar la tienda especificada. Por favor, inténtelo de nuevo o seleccione una tienda diferente.')
    }
    
    // Check if we're updating the image
    const isUpdatingImage = values.logo instanceof File;
    
    try {
      // Update the store
      await handleUpdateStore(id as string, values)
      
      // If updating an image, add a delay to allow Cloudinary to process and propagate the new image
      if (isUpdatingImage) {
        console.log("Image was updated, adding delay before refetching store data");
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
      }
      
      // After successful update, fetch the updated store data
      console.log("Re-fetching store data after update");
      await fetchStoreById(id as string);
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return (
    <>
      <Head>
        <title>Editar tienda | Gifty Platform</title>
      </Head>
      <DashboardLayout title="Editar tienda" requiredRoles={['admin', 'store_manager']}>
        <StoreForm
          initialValues={selectedStore}
          onSubmit={handleSubmit}
          isLoading={submitting}
          title={`Editar tienda: ${selectedStore.name}`}
          isEditMode={true}
        />
      </DashboardLayout>
    </>
  )
}

export default EditStorePage 