# 🎁 Gifty - Gift Vouchers Platform

A white-label solution for businesses to create, sell, and manage gift vouchers.

## 🚀 Features

- **Admin Dashboard** for Store Managers and Admins
- **Customer Portal** for end-users to purchase vouchers
- **Authentication** via NextAuth.js
- **Payments** via MercadoPago
- **White-Label Customization**
- **Voucher Validation** via QR Code & Unique Codes
- **Analytics Dashboard** for business insights
- **User Management** for different access levels

## 🛠 Tech Stack

- **Framework:** Next.js (Pages Router)
- **UI Library:** Ant Design
- **Charts:** Ant Design Charts
- **State Management:** React Query
- **Authentication:** NextAuth.js
- **API Integration:** Axios
- **Architecture:** Feature-based architecture with clean separation of concerns
- **Testing:** Jest + React Testing Library

## 📦 Project Structure

```
src/
├── config/           # Configuration files
│   ├── constants.ts  # Global constants
│   ├── menu/         # Menu configuration
├── features/         # Feature modules
│   ├── dashboard/    # Dashboard feature
│   ├── login/        # Authentication feature
│   ├── vouchers/     # Vouchers feature
│   ├── users/        # User management feature
│   ├── stores/       # Store management feature
│   ├── checkout/     # Checkout feature
│   └── shared/       # Shared components
├── layouts/          # Layout components
│   ├── DashboardLayout.tsx    # Admin dashboard layout
│   └── FullWidthLayout.tsx    # Full-width layout for auth
├── mockups/          # Mock data for development
├── pages/            # Next.js pages
│   ├── api/          # API routes
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard pages
├── styles/           # Global styles
└── types/            # TypeScript type definitions
```

## 🔒 Authentication Flow

The platform uses NextAuth.js for authentication with:

- JWT token-based authentication
- Role-based access control (Admin, Store Manager)
- Protected routes with session validation
- API route authentication

## 📊 Dashboard Features

- **Overview Cards:** Quick metrics of business performance
- **Sales Analytics:** Visual representation of sales data
- **Voucher Performance:** Top-selling vouchers
- **Order Management:** Recent orders and status tracking
- **Store Performance:** Analysis by store

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gifty.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🛠 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## 📝 License

ISC