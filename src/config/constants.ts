// More robust API URL configuration
let apiUrl: string;
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error('CRITICAL: Missing NEXT_PUBLIC_API_URL in production environment');
    // In production, fail early rather than using localhost
    throw new Error('API configuration error: Missing NEXT_PUBLIC_API_URL environment variable');
  }
  apiUrl = process.env.NEXT_PUBLIC_API_URL;
} else {
  // Only use fallback in development
  apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
}

export const API_URL = apiUrl; 