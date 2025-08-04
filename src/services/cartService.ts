import { pool } from '../config/database';
import { CartItem, CartItemWithProduct, Cart, AddToCartRequest, UpdateCartItemRequest, Product } from '../types';
import { ProductService } from './productService';

export class CartService {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async addToCart(cartData: AddToCartRequest): Promise<CartItemWithProduct | null> {
    const connection = await pool.getConnection();
    
    try {
      // Check if product exists and has sufficient stock
      const product = await this.productService.getProductById(cartData.productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stockLevel < cartData.quantity) {
        throw new Error('Insufficient stock');
      }

      // Check if item already exists in cart
      const [existingItems] = await connection.execute(
        'SELECT * FROM cart_items WHERE product_id = ?',
        [cartData.productId]
      );

      if ((existingItems as any[]).length > 0) {
        // Update existing item quantity
        const existingItem = (existingItems as any[])[0];
        const newQuantity = existingItem.quantity + cartData.quantity;
        
        await connection.execute(
          'UPDATE cart_items SET quantity = ? WHERE id = ?',
          [newQuantity, existingItem.id]
        );

        return this.getCartItemById(existingItem.id);
      } else {
        // Add new item to cart
        const [result] = await connection.execute(
          'INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)',
          [cartData.productId, cartData.quantity]
        );

        const cartItemId = (result as any).insertId;
        return this.getCartItemById(cartItemId);
      }
    } finally {
      connection.release();
    }
  }

  async updateCartItem(itemId: number, updateData: UpdateCartItemRequest): Promise<CartItemWithProduct | null> {
    const connection = await pool.getConnection();
    
    try {
      // Get current cart item
      const currentItem = await this.getCartItemById(itemId);
      if (!currentItem) {
        return null;
      }

      // Check stock availability
      const product = await this.productService.getProductById(currentItem.productId);
      if (!product || product.stockLevel < updateData.quantity) {
        throw new Error('Insufficient stock');
      }

      // Update quantity
      await connection.execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [updateData.quantity, itemId]
      );

      return this.getCartItemById(itemId);
    } finally {
      connection.release();
    }
  }

  async removeFromCart(itemId: number): Promise<boolean> {
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute('DELETE FROM cart_items WHERE id = ?', [itemId]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  async getCart(): Promise<Cart> {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.execute(`
        SELECT ci.*, p.* 
        FROM cart_items ci 
        JOIN products p ON ci.product_id = p.id
        ORDER BY ci.created_at DESC
      `);

      const cartItems: CartItemWithProduct[] = (rows as any[]).map(row => ({
        id: row.id,
        productId: row.product_id,
        quantity: row.quantity,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        product: {
          id: row.product_id,
          sku: row.sku,
          name: row.name,
          description: row.description,
          price: parseFloat(row.price),
          stockLevel: row.stock_level,
          categoryId: row.category_id,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at)
        },
        subtotal: parseFloat(row.price) * row.quantity
      }));

      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

      return {
        items: cartItems,
        totalItems,
        totalAmount
      };
    } finally {
      connection.release();
    }
  }

  async getCartItemById(itemId: number): Promise<CartItemWithProduct | null> {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.execute(`
        SELECT ci.*, p.* 
        FROM cart_items ci 
        JOIN products p ON ci.product_id = p.id 
        WHERE ci.id = ?
      `, [itemId]);

      if ((rows as any[]).length === 0) {
        return null;
      }

      const row = (rows as any[])[0];
      return {
        id: row.id,
        productId: row.product_id,
        quantity: row.quantity,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        product: {
          id: row.product_id,
          sku: row.sku,
          name: row.name,
          description: row.description,
          price: parseFloat(row.price),
          stockLevel: row.stock_level,
          categoryId: row.category_id,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at)
        },
        subtotal: parseFloat(row.price) * row.quantity
      };
    } finally {
      connection.release();
    }
  }

  async clearCart(): Promise<void> {
    const connection = await pool.getConnection();
    
    try {
      await connection.execute('DELETE FROM cart_items');
    } finally {
      connection.release();
    }
  }
} 