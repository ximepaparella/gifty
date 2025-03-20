import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { App } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Product, ProductFormData, ProductsState } from '../types'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../services/productService'

// Query keys
const PRODUCTS_QUERY_KEY = 'products'
const PRODUCT_DETAIL_QUERY_KEY = 'product-detail'

export const useProducts = () => {
  const { notification } = App.useApp();
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [paginationParams, setPaginationParams] = useState({
    current: 1,
    pageSize: 10,
    sort: ''
  })
  
  const [state, setState] = useState<Omit<ProductsState, 'products' | 'pagination'>>({
    selectedProduct: null,
    loading: false,
    submitting: false
  })

  // Fetch products list with pagination
  const { 
    data: productsData,
    isLoading,
    isError,
    error: productsError
  } = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, paginationParams],
    queryFn: () => getProducts(
      paginationParams.current,
      paginationParams.pageSize,
      paginationParams.sort
    ),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60000, // 1 minute
  })

  // Handle error display for the products query
  if (isError && productsError) {
    notification.error({
      message: 'Error fetching products',
      description: (productsError as Error).message
    })
  }

  // Fetch product by ID
  const fetchProductById = useCallback(async (id: string) => {
    try {
      // Prevent unnecessary re-fetching if we already have the product
      if (state.selectedProduct && 
          (state.selectedProduct.id === id || state.selectedProduct._id === id)) {
        console.log("Product already loaded, skipping fetch");
        return state.selectedProduct;
      }
      
      setState(prev => ({ ...prev, loading: true }));
      console.log("Fetching product with ID:", id);
      const product = await getProductById(id);
      console.log("Fetched product:", product);
      setState(prev => ({ ...prev, selectedProduct: product, loading: false }));
      return product;
    } catch (error: any) {
      console.error("Error fetching product:", error);
      notification.error({
        message: 'Error fetching product',
        description: error.message
      });
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [notification, state.selectedProduct]);

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (productData: ProductFormData) => createProduct(productData),
    onMutate: () => {
      setState(prev => ({ ...prev, submitting: true }))
    },
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Product created successfully'
      })
      setState(prev => ({ ...prev, submitting: false }))
      router.push('/dashboard/products')
      return queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error creating product',
        description: error.message
      })
      setState(prev => ({ ...prev, submitting: false }))
    }
  })

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, productData }: { id: string; productData: ProductFormData }) => 
      updateProduct(id, productData),
    onMutate: () => {
      setState(prev => ({ ...prev, submitting: true }))
    },
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Product updated successfully'
      })
      setState(prev => ({ ...prev, submitting: false }))
      router.push('/dashboard/products')
      return queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error updating product',
        description: error.message
      })
      setState(prev => ({ ...prev, submitting: false }))
    }
  })

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Product deleted successfully'
      })
      return queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Error deleting product',
        description: error.message
      })
    }
  })

  // Handle table pagination change
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const sort = sorter.order 
      ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}`
      : '';
    
    setPaginationParams({
      current: pagination.current,
      pageSize: pagination.pageSize,
      sort
    })
  }

  // Handle product creation
  const handleCreateProduct = async (productData: ProductFormData) => {
    createProductMutation.mutate(productData)
  }

  // Handle product update
  const handleUpdateProduct = async (id: string, productData: ProductFormData) => {
    updateProductMutation.mutate({ id, productData })
  }

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    deleteProductMutation.mutate(id)
  }

  return {
    products: productsData?.data || [],
    selectedProduct: state.selectedProduct,
    loading: isLoading || state.loading,
    submitting: state.submitting,
    pagination: {
      current: paginationParams.current,
      pageSize: paginationParams.pageSize,
      total: productsData?.pagination?.total || 0
    },
    fetchProductById,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleTableChange
  }
} 