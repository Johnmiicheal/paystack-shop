export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  stockLevel: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
  subtotal: number;
}

export interface Cart {
  items: CartItemWithProduct[];
  totalItems: number;
  totalAmount: number;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  description: string;
  price: number;
  stockLevel: number;
  categoryId: number;
}

export interface UpdateProductRequest {
  sku?: string;
  name?: string;
  description?: string;
  price?: number;
  stockLevel?: number;
  categoryId?: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 