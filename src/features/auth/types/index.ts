/**
 * Type definitions for custom auth system
 */

export interface AuthSession {
  user: UserInfo
  accessToken: string
  expires: string
}

export interface UserInfo {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthToken {
  token: string
  expiresAt: number
} 