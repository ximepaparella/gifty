import { render, screen } from '@testing-library/react';
import RequireAuth from '@/features/auth/components/RequireAuth';
import { authService } from '@/features/auth/services/authService';

// Mock the auth service
jest.mock('@/features/auth/services/authService', () => ({
  authService: {
    getSession: jest.fn(),
  },
}));

describe('RequireAuth', () => {
  const mockSession = {
    user: {
      role: 'admin',
    },
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (authService.getSession as jest.Mock).mockReturnValue(null);
    
    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    );

    // Check for Ant Design's Spin component using aria-busy attribute
    const loadingElement = document.querySelector('[aria-busy="true"]');
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    (authService.getSession as jest.Mock).mockReturnValue(mockSession);
    
    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders children when user has correct role', () => {
    (authService.getSession as jest.Mock).mockReturnValue(mockSession);
    
    render(
      <RequireAuth allowedRoles={['admin']}>
        <div>Admin Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
}); 