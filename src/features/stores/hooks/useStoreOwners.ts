import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/features/users/services/userService'
import { User } from '@/features/users/types'

interface OwnerMap {
  [key: string]: User | null
}

export const useStoreOwners = () => {
  const [ownerMap, setOwnerMap] = useState<OwnerMap>({})
  
  // Fetch all users to build the owner map
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users-for-owners'],
    queryFn: () => getUsers(1, 100), // Get a large batch of users to map owners
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  })
  
  // Build a map of owner IDs to user objects
  useEffect(() => {
    if (usersData?.data) {
      const users = usersData.data
      const newOwnerMap: OwnerMap = {}
      
      users.forEach(user => {
        // Users have 'id', stores reference them with 'ownerId'
        newOwnerMap[user.id] = user
      })
      
      setOwnerMap(newOwnerMap)
    }
  }, [usersData])
  
  // Function to get owner details by ID
  const getOwnerById = (ownerId: string): User | null => {
    // Check if we have a direct match
    if (ownerMap[ownerId]) {
      return ownerMap[ownerId]
    }
    
    // For debugging
    console.log(`Looking for owner with ID: ${ownerId}`)
    console.log('Available owner IDs:', Object.keys(ownerMap))
    
    // Return null if not found
    return null
  }
  
  return {
    getOwnerById,
    ownerMap,
    isLoading,
    error
  }
} 