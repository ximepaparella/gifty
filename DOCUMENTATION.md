# Gifty Platform Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication Flow](#authentication-flow)
3. [Store Management Flow](#store-management-flow)
4. [Product Management Flow](#product-management-flow)
5. [Image Upload Flow](#image-upload-flow)
6. [Data Management](#data-management)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

## Architecture Overview

The Gifty platform follows a feature-based architecture with clean separation of concerns:

```
features/
├── auth/           # Authentication feature
│   ├── components/ # Auth-specific components
│   ├── hooks/      # Custom hooks for auth
│   ├── services/   # Auth API services
│   └── types/      # Auth type definitions
├── stores/         # Store management feature
├── products/       # Product management feature
└── ...
```

Each feature module is self-contained and includes:
- Components
- Services (API calls)
- Types
- Hooks
- Utils (if needed)

## Authentication Flow

1. **Login Process**
   - User submits credentials
   - JWT token received and stored
   - User data cached in React Query
   - Redirect to dashboard

2. **Session Management**
   - JWT stored in localStorage
   - Token included in API requests
   - Session expiry handling
   - Automatic logout on token expiration

3. **Route Protection**
   - Middleware checks for valid token
   - Role-based access control
   - Redirect to login if unauthorized

## Store Management Flow

1. **Store Creation**
   ```typescript
   // Store data structure
   interface StoreFormData {
     name: string;
     email: string;
     phone: string;
     address: string;
     ownerId: string;
     logo?: File | null;
     social: {
       instagram: string | null;
       facebook: string | null;
       tiktok: string | null;
       youtube: string | null;
       others: Array<{name: string, url: string}>;
     };
   }
   ```

2. **Image Upload Process**
   - Client-side validation (size, type)
   - FormData creation
   - Cloudinary upload via backend
   - URL storage in database

3. **Store Update Flow**
   - Existing data pre-population
   - Image replacement handling
   - Social media links management
   - Owner reassignment

## Product Management Flow

1. **Product Creation**
   ```typescript
   // Product data structure
   interface ProductFormData {
     name: string;
     description: string;
     price: number;
     storeId: string;
     image?: File | null;
     isActive: boolean;
   }
   ```

2. **Product-Store Association**
   - Store selection validation
   - Owner verification
   - Product categorization
   - Image management

## Image Upload Flow

1. **Client-Side Handling**
   ```typescript
   // Image validation
   const beforeUpload = (file: RcFile) => {
     const isImage = file.type.startsWith('image/');
     const isLt2M = file.size / 1024 / 1024 < 2;
     return isImage && isLt2M;
   };
   ```

2. **Upload Process**
   - File selection
   - Preview generation
   - FormData preparation
   - Progress tracking
   - Error handling

3. **Backend Processing**
   - Cloudinary upload
   - URL storage
   - Cleanup of old images

## Data Management

1. **React Query Implementation**
   - Cached data management
   - Optimistic updates
   - Background refetching
   - Error boundaries

2. **State Management**
   ```typescript
   // Example query hook
   const useStores = () => {
     return useQuery({
       queryKey: ['stores'],
       queryFn: fetchStores,
       staleTime: 60000,
     });
   };
   ```

## Error Handling

1. **API Error Structure**
   ```typescript
   interface ApiError {
     status: string;
     message: string;
     details?: any;
   }
   ```

2. **Error Handling Flow**
   - Client-side validation
   - API error catching
   - User feedback
   - Error recovery

## Best Practices

1. **Code Organization**
   - Feature-based structure
   - Shared components
   - Type safety
   - Clean code principles

2. **Performance Optimization**
   - Image optimization
   - Query caching
   - Lazy loading
   - Bundle optimization

3. **Security Measures**
   - Input validation
   - XSS prevention
   - CSRF protection
   - Secure file upload

4. **Testing Strategy**
   - Unit tests
   - Integration tests
   - E2E tests
   - Test coverage

## API Integration

1. **Service Layer Pattern**
   ```typescript
   // Example service
   export const storeService = {
     create: async (data: StoreFormData) => {
       // Implementation
     },
     update: async (id: string, data: StoreFormData) => {
       // Implementation
     },
     // ...
   };
   ```

2. **API Configuration**
   - Base URL management
   - Headers setup
   - Request/response interceptors
   - Error handling

## Form Handling

1. **Form Structure**
   - Ant Design Form usage
   - Field validation
   - Custom components
   - Error messages

2. **Validation Rules**
   ```typescript
   const rules = {
     required: { required: true, message: 'Campo requerido' },
     email: { type: 'email', message: 'Email inválido' },
     // ...
   };
   ```

## Deployment

1. **Build Process**
   - Environment variables
   - Build optimization
   - Static generation
   - API routes

2. **Production Considerations**
   - Error logging
   - Performance monitoring
   - Security headers
   - Cache management 