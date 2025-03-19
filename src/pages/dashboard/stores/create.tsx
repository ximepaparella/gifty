import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import StoreForm from '@/features/stores/components/StoreForm'
import { useStores } from '@/features/stores/hooks/useStores'

const CreateStorePage = () => {
  const { submitting, handleCreateStore } = useStores()

  return (
    <>
      <Head>
        <title>Crear tienda | Gifty Platform</title>
      </Head>
      <DashboardLayout title="Crear tienda" requiredRoles={['admin', 'store_manager']}>
        <StoreForm
          onSubmit={handleCreateStore}
          isLoading={submitting}
          title="Crear nueva tienda"
        />
      </DashboardLayout>
    </>
  )
}

export default CreateStorePage 