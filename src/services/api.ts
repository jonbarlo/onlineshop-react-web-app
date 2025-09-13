import axios, { AxiosInstance } from 'axios';
import {
  ApiResponse,
  AuthResponse,
  Product,
  Order,
  CreateOrderRequest,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateOrderStatusRequest,
  DashboardApiResponse,
  ProductQueryParams,
  OrderQueryParams,
  PaginatedResponse,
  AdminOrdersApiResponse,
  ProductsApiResponse,
  ImageUploadResponse,
  ImageDeleteResponse,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Try to get API URL from theme first, then fall back to environment variable
    const themeApiUrl = import.meta.env.VITE_THEME_API_URL;
    const envApiUrl = import.meta.env.VITE_API_BASE_URL;
    const baseURL = themeApiUrl || envApiUrl;
    console.log('API Base URL:', baseURL);
    
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: false,
    });

    // Request interceptor to add auth token and log requests
    this.api.interceptors.request.use(
      (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and logging
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.config.url, response.status, response.data);
        return response;
      },
      (error) => {
        console.error('API Error:', error.config?.url, error.message, error.response?.data);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse> {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Authentication
  async login(username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/api/auth/login', { username, password });
    return response.data;
  }

  // Products (Public)
  async getProducts(params: ProductQueryParams = {}): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const response = await this.api.get('/api/products', { params });
    return response.data;
  }

  async getProductsByCategory(category: string, params: Omit<ProductQueryParams, 'category'> = {}): Promise<ApiResponse<PaginatedResponse<Product>>> {
    // Backend expects categorySlug parameter, not category
    const requestParams = { ...params, categorySlug: category };
    console.log('API Service - getProductsByCategory called with:', { category, params, requestParams });
    
    const response = await this.api.get('/api/products', { 
      params: requestParams 
    });
    
    console.log('API Service - getProductsByCategory response:', response.data);
    return response.data;
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    const response = await this.api.get(`/api/products/${id}`);
    return response.data;
  }

  // Orders (Public)
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    const response = await this.api.post('/api/orders', orderData);
    return response.data;
  }

  // Admin Products
  async getAdminProducts(params: ProductQueryParams = {}): Promise<ProductsApiResponse> {
    const response = await this.api.get('/api/admin/products', { params });
    return response.data;
  }

  async getAdminProduct(id: number): Promise<ApiResponse<Product>> {
    const response = await this.api.get(`/api/admin/products/${id}`);
    return response.data;
  }

  async createProduct(productData: CreateProductRequest): Promise<ApiResponse<Product>> {
    const response = await this.api.post('/api/admin/products', productData);
    return response.data;
  }

  async updateProduct(id: number, productData: UpdateProductRequest): Promise<ApiResponse<Product>> {
    // Use the correct endpoint pattern
    const endpoint = `/api/admin/products/${id}`;
    
    try {
      console.log(`Updating product with endpoint: ${endpoint}`);
      console.log('Product data being sent:', JSON.stringify(productData, null, 2));
      const response = await this.api.put(endpoint, productData);
      console.log(`Product update successful with endpoint: ${endpoint}`);
      return response.data;
    } catch (error: unknown) {
      console.log(`Endpoint ${endpoint} failed:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        console.log('Backend error response:', axiosError.response?.data);
        console.log('Backend error status:', axiosError.response?.status);
      }
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<ApiResponse> {
    const response = await this.api.delete(`/api/admin/products/${id}`);
    return response.data;
  }

  // Orders (Public)
  async getOrders(params: OrderQueryParams = {}): Promise<ApiResponse<PaginatedResponse<Order>>> {
    const response = await this.api.get('/api/orders', { params });
    return response.data;
  }

  async getOrder(id: number): Promise<ApiResponse<Order>> {
    const response = await this.api.get(`/api/orders/${id}`);
    return response.data;
  }

  // Admin Orders
  async getAdminOrders(params: OrderQueryParams = {}): Promise<AdminOrdersApiResponse> {
    const response = await this.api.get('/api/admin/orders', { params });
    return response.data;
  }

  async getAdminOrder(id: number): Promise<ApiResponse<Order>> {
    const response = await this.api.get(`/api/admin/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(id: number, statusData: UpdateOrderStatusRequest): Promise<ApiResponse<Order>> {
    const response = await this.api.put(`/api/admin/orders/${id}/status`, statusData);
    return response.data;
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardApiResponse> {
    const response = await this.api.get('/api/admin/dashboard');
    return response.data;
  }

  // Image Upload
  async uploadProductImage(file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await this.api.post('/api/upload/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteProductImage(filename: string): Promise<ImageDeleteResponse> {
    const response = await this.api.delete(`/api/upload/product-image/${filename}`);
    return response.data;
  }

  // Category Management Methods
  async getCategories(): Promise<{ success: boolean; data: Category[]; message: string }> {
    console.log('API Request: GET /api/admin/categories');
    const response = await this.api.get('/api/admin/categories');
    console.log('API Response: /api/admin/categories', response.status, response.data);
    return response.data;
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<{ success: boolean; data: Category; message: string }> {
    console.log('API Request: POST /api/admin/categories', categoryData);
    const response = await this.api.post('/api/admin/categories', categoryData);
    console.log('API Response: /api/admin/categories', response.status, response.data);
    return response.data;
  }

  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<{ success: boolean; data: Category; message: string }> {
    console.log(`API Request: PUT /api/admin/categories/${id}`, categoryData);
    const response = await this.api.put(`/api/admin/categories/${id}`, categoryData);
    console.log(`API Response: /api/admin/categories/${id}`, response.status, response.data);
    return response.data;
  }

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    console.log(`API Request: DELETE /api/admin/categories/${id}`);
    const response = await this.api.delete(`/api/admin/categories/${id}`);
    console.log(`API Response: /api/admin/categories/${id}`, response.status, response.data);
    return response.data;
  }
}

export const apiService = new ApiService();
