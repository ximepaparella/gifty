# Authentication and Dashboard Implementation

## Overview
This PR introduces the core authentication system and the admin dashboard for the Gifty Platform. It sets up the foundation for all future features and establishes the UI patterns that will be used throughout the application.

## Features

### 🔐 Authentication
- Implemented login flow using NextAuth.js with JWT tokens
- Created a clean full-width layout for authentication pages
- Set up session handling and protected routes
- Implemented API authentication with token management

### 📊 Admin Dashboard
- Created a responsive dashboard layout with collapsible sidebar
- Implemented dynamic menu system with role-based access control
- Built analytics dashboard with various visualization components:
  - Summary statistics cards
  - Sales performance metrics
  - Monthly sales activity chart
  - Top selling vouchers table
  - Recent orders table
  - Revenue distribution by sales channel
  - Voucher distribution by store

### 🛠 Infrastructure
- Established clean, modular project structure
- Set up a configurable menu system for easy navigation management
- Implemented mock data layer for development
- Created service layer with API token handling
- Added Ant Design theme configuration for consistent UI

## Technical Details
- Used NextAuth.js with credentials provider for authentication
- Implemented Ant Design Charts for data visualization
- Created a robust dashboard layout component
- Separated menu configuration from component implementation
- Set up authenticated API service for future endpoint integration

## Testing
- Tested on multiple viewport sizes for responsive design
- Verified authentication flow including session persistence
- Confirmed all dashboard visualizations render correctly

## Screenshots
*[Screenshots would be added here in a real PR]*

## Next Steps
- Implement voucher management CRUD operations
- Add user management functionality
- Create store management features
- Implement customer-facing voucher browsing and purchasing 