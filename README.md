# Gifty Platform

Gifty is a modern e-commerce platform built with Next.js, focusing on gift card and voucher management for stores and services.

## 🚀 Features

- 🔐 Authentication & Authorization
- 🏪 Store Management
- 🎁 Product Management
- 🎫 Voucher System
- 📊 Dashboard Analytics
- 👥 User Management
- 🛍️ Order Processing
- 🖼️ Image Upload & Management

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js with TypeScript
- **UI Library**: Ant Design
- **State Management**: React Query
- **API Client**: Axios
- **Form Handling**: Ant Design Form
- **Image Storage**: Cloudinary
- **Authentication**: JWT
- **Code Quality**: ESLint & Prettier

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance
- Cloudinary account

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/gifty.git
cd gifty
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## 🏗️ Project Structure

```
src/
├── components/     # Shared components
├── config/        # Configuration files
├── features/      # Feature modules
│   ├── auth/      # Authentication
│   ├── stores/    # Store management
│   ├── products/  # Product management
│   ├── vouchers/  # Voucher system
│   ├── users/     # User management
│   └── order/     # Order processing
├── layouts/       # Page layouts
├── pages/         # Next.js pages
├── styles/        # Global styles
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## 🔑 Key Features

### Authentication
- JWT-based authentication
- Role-based access control
- Protected routes

### Store Management
- Create and manage stores
- Upload store logos
- Manage store information and social media links
- Store owner assignment

### Product Management
- Create and manage products
- Product image upload
- Price management
- Store association

### Voucher System
- Create and manage vouchers
- Voucher validation
- Usage tracking

### User Management
- User roles (Admin, Store Manager, Customer)
- User profile management
- Access control

## 🧪 Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## 📚 Documentation

For detailed documentation about the platform's features and implementations, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.