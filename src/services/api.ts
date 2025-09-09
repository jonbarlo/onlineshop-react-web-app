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
  DashboardStats,
  ProductQueryParams,
  OrderQueryParams,
  PaginatedResponse,
  AdminOrdersApiResponse,
  ProductsApiResponse,
  ImageUploadResponse,
  ImageDeleteResponse,
} from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
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
    const response = await this.api.get('/api/products', { params });
    return response.data;
  }

  async createProduct(productData: CreateProductRequest): Promise<ApiResponse<Product>> {
    const response = await this.api.post('/api/admin/products', productData);
    return response.data;
  }

  async updateProduct(id: number, productData: UpdateProductRequest): Promise<ApiResponse<Product>> {
    // Try different endpoint patterns
    const endpoints = [
      `/api/admin/products/${id}`,  // Standard REST endpoint first
      `/api/admin/products/${id}/update`,  // Custom endpoint second
    ];
    
    let lastError: unknown;
    
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      try {
        console.log(`Trying product update endpoint ${i + 1}/${endpoints.length}: ${endpoint}`);
        const response = await this.api.put(endpoint, productData);
        console.log(`Product update successful with endpoint: ${endpoint}`);
        return response.data;
      } catch (error: unknown) {
        console.log(`Endpoint ${endpoint} failed:`, error);
        lastError = error;
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 404 && i < endpoints.length - 1) {
            // Try next endpoint
            console.log(`404 error on ${endpoint}, trying next endpoint...`);
            continue;
          }
        }
        
        // If this is the last endpoint or not a 404, throw the error
        if (i === endpoints.length - 1) {
          throw error;
        }
      }
    }
    
    throw lastError || new Error('No working endpoint found for product update');
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
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
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
}

export const apiService = new ApiService();
