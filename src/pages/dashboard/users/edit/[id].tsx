import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Spin, Alert } from 'antd'
import DashboardLayout from '@/layouts/DashboardLayout'
import UserForm from '@/features/users/components/UserForm'
import { useUsers } from '@/features/users/hooks/useUsers'

const EditUserPage = () => {
  const { selectedUser, loading, submitting, fetchUserById, handleUpdateUser } = useUsers()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady) return
    
    const { id } = router.query
    
    if (!id) {
      setError('No user ID provided in the URL')
      return
    }
    
    // Clear any previous errors
    setError(null)
    
    // Fetch user data
    fetchUserById(id as string)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query])

  if (error) {
    return (
      <DashboardLayout title="Edit User">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <a onClick={() => router.push('/dashboard/users')}>
              Return to Users List
            </a>
          }
        />
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout title="Editar usuario">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" tip="Cargando información del usuario..." />
        </div>
      </DashboardLayout>
    )
  }

  if (!selectedUser) {
    return (
      <DashboardLayout title="Editar usuario">
        <Alert
          message="Usuario no encontrado"
          description="No se pudo encontrar el usuario especificado. Por favor, inténtelo de nuevo o seleccione un usuario diferente."
          type="warning"
          showIcon
          action={
            <a onClick={() => router.push('/dashboard/users')}>
              Return to Users List
            </a>
          }
        />
      </DashboardLayout>
    )
  }


  const handleSubmit = (values: any) => {
    const { id } = router.query
    if (!id) {
      return Promise.reject('No se pudo encontrar el usuario especificado. Por favor, inténtelo de nuevo o seleccione un usuario diferente.')
    }
    return handleUpdateUser(id as string, values)
  }

  return (
    <>
      <Head>
        <title>Editar usuario | Gifty Platform</title>
      </Head>
      <DashboardLayout title="Editar usuario">
        <UserForm
          initialValues={selectedUser}
          onSubmit={handleSubmit}
          isLoading={submitting}
          title={`Editar usuario: ${selectedUser.name}`}
          isEditMode={true}
        />
      </DashboardLayout>
    </>
  )
}

export default EditUserPage 