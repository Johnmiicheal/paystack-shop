import { ProductService } from '../services/productService';
import { CreateProductRequest, UpdateProductRequest } from '../types';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const productData: CreateProductRequest = {
        sku: 'TEST-002',
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stockLevel: 10,
        categoryId: 1
      };

      const product = await productService.createProduct(productData);

      expect(product).toBeDefined();
      expect(product.sku).toBe(productData.sku);
      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(productData.price);
      expect(product.stockLevel).toBe(productData.stockLevel);
    });
  });

  describe('getProductById', () => {
    it('should return null for non-existent product', async () => {
      const product = await productService.getProductById(99999);
      expect(product).toBeNull();
    });
  });

  describe('getProductBySku', () => {
    it('should return null for non-existent SKU', async () => {
      const product = await productService.getProductBySku('NON-EXISTENT');
      expect(product).toBeNull();
    });
  });

  describe('updateProduct', () => {
    it('should return null for non-existent product', async () => {
      const updateData: UpdateProductRequest = {
        name: 'Updated Name'
      };

      const product = await productService.updateProduct(99999, updateData);
      expect(product).toBeNull();
    });
  });

  describe('deleteProduct', () => {
    it('should return false for non-existent product', async () => {
      const deleted = await productService.deleteProduct(99999);
      expect(deleted).toBe(false);
    });
  });
}); 