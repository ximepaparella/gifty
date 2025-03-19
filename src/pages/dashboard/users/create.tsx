import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import UserForm from '@/features/users/components/UserForm'
import { useUsers } from '@/features/users/hooks/useUsers'

const CreateUserPage = () => {
  const { submitting, handleCreateUser } = useUsers()

  return (
    <>
      <Head>
        <title>Create User | Gifty Platform</title>
      </Head>
      <DashboardLayout title="Create User">
        <UserForm
          onSubmit={handleCreateUser}
          isLoading={submitting}
          title="Create New User"
        />
      </DashboardLayout>
    </>
  )
}

export default CreateUserPage 