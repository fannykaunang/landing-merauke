// Types untuk aplikasi

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
  website_count?: number;
}

export interface Website {
  id: number;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  category_id: number | null;
  tags: string | null;
  featured: number | boolean;
  is_active: number | boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category_name?: string;
  category_slug?: string;
  category_icon?: string;
}

export interface WebsiteWithCategory extends Website {
  category?: Category;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  email_verified: boolean;
  image: string | null;
  is_active: boolean;
  role: "admin" | "user";
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  expires_at: string;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  last_activity: string | null;
  created_at: string;
}

export interface OTPCode {
  id: number;
  email: string;
  code: string;
  type: "login" | "register" | "reset_password";
  expires_at: string;
  is_used: boolean;
  created_at: string;
}

export interface LoginAttempt {
  id: number;
  email: string | null;
  ip_address: string;
  user_agent: string | null;
  success: boolean;
  created_at: string;
}

export interface CSRFToken {
  id: number;
  token: string;
  session_id: string | null;
  expires_at: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
  email_verified: boolean;
  is_active: boolean;
  image: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}
