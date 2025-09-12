// App Configuration
export interface AppConfig {
  siteName: string;
  siteDescription: string;
}

// Dashboard Types
export interface DashboardStatistics {
  totalOrders: number;
  newOrders: number;
  paidOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  repeatCustomers: number;
}

export interface DashboardPerformance {
  conversionRate: string;
  averageOrderValue: string;
  stockTurnover: string;
  lowStockAlert: boolean;
}

export interface DashboardAlerts {
  lowStock: number;
  soldOut: number;
  newOrders: number;
  readyForDelivery: number;
}

export interface CategoryStat {
  id: number;
  name: string;
  productCount: number;
}

export interface DashboardData {
  statistics: DashboardStatistics;
  performance: DashboardPerformance;
  alerts: DashboardAlerts;
  recentOrders: Order[];
  recentProducts: Product[];
  categoryStats: CategoryStat[];
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface AdminOrdersResponse {
  orders: Order[];
  pagination: PaginationMeta;
}

export interface AdminOrdersApiResponse {
  success: boolean;
  message: string;
  data: Order[];
  pagination: PaginationMeta;
  timestamp: string;
}

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data: Product[];
  timestamp: string;
}

// Image Upload Types
export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    originalName: string;
    size: number;
    imageUrl: string;
  };
  timestamp: string;
}

export interface ImageDeleteResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isActive: boolean;
  quantity: number;
  status: 'available' | 'sold_out';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  isActive?: boolean;
  quantity?: number;
}

// Order Types
export type OrderStatus = 'new' | 'paid' | 'ready_for_delivery';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    imageUrl: string;
  };
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// Dashboard Types
export interface DashboardStats {
  totalOrders: number;
  newOrders: number;
  paidOrders: number;
  readyForDeliveryOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

// Query Parameters
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  q?: string; // Query parameter for search
  category?: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
}

export interface OrderForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
