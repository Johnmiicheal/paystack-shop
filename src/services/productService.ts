import { pool } from '../config/database';
import { Product, CreateProductRequest, UpdateProductRequest, PaginatedResponse } from '../types';

export class ProductService {
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute(
        'INSERT INTO products (sku, name, description, price, stock_level, category_id) VALUES (?, ?, ?, ?, ?, ?)',
        [productData.sku, productData.name, productData.description, productData.price, productData.stockLevel, productData.categoryId]
      );
      
      const productId = (result as any).insertId;
      const product = await this.getProductById(productId);
      
      if (!product) {
        throw new Error('Failed to create product');
      }
      
      return product;
    } finally {
      connection.release();
    }
  }

  async getAllProducts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Product>> {
    const connection = await pool.getConnection();
    
    try {
      const offset = (page - 1) * limit;
      
      // Get total count
      const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM products');
      const total = (countResult as any)[0].total;
      
      // Get products with pagination - Use query instead of execute to avoid prepared statement issues
      const [rows] = await connection.query(
        'SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      const products = (rows as any[]).map(this.mapRowToProduct);
      
      return {
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } finally {
      connection.release();
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [id]);
      
      if ((rows as any[]).length === 0) {
        return null;
      }
      
      return this.mapRowToProduct((rows as any[])[0]);
    } finally {
      connection.release();
    }
  }

  async getProductBySku(sku: string): Promise<Product | null> {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.execute('SELECT * FROM products WHERE sku = ?', [sku]);
      
      if ((rows as any[]).length === 0) {
        return null;
      }
      
      return this.mapRowToProduct((rows as any[])[0]);
    } finally {
      connection.release();
    }
  }

  async updateProduct(id: number, updateData: UpdateProductRequest): Promise<Product | null> {
    const connection = await pool.getConnection();
    
    try {
      const existingProduct = await this.getProductById(id);
      if (!existingProduct) {
        return null;
      }

      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (updateData.sku !== undefined) {
        updateFields.push('sku = ?');
        updateValues.push(updateData.sku);
      }
      if (updateData.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(updateData.name);
      }
      if (updateData.description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(updateData.description);
      }
      if (updateData.price !== undefined) {
        updateFields.push('price = ?');
        updateValues.push(updateData.price);
      }
      if (updateData.stockLevel !== undefined) {
        updateFields.push('stock_level = ?');
        updateValues.push(updateData.stockLevel);
      }
      if (updateData.categoryId !== undefined) {
        updateFields.push('category_id = ?');
        updateValues.push(updateData.categoryId);
      }

      if (updateFields.length === 0) {
        return existingProduct;
      }

      updateValues.push(id);
      await connection.execute(
        `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      return this.getProductById(id);
    } finally {
      connection.release();
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  async updateStockLevel(id: number, quantity: number): Promise<boolean> {
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute(
        'UPDATE products SET stock_level = stock_level - ? WHERE id = ? AND stock_level >= ?',
        [quantity, id, quantity]
      );
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  private mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      sku: row.sku,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      stockLevel: row.stock_level,
      categoryId: row.category_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
} 