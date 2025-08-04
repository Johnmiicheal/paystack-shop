import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { ApiResponse, CreateProductRequest, UpdateProductRequest } from '../types';
import { asyncHandler, CustomError } from '../middleware/errorHandler';
import { datadogLogger, addMetric, addEvent } from '../utils/datadog';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const productData: CreateProductRequest = req.body;

    datadogLogger.info('Creating new product', {
      sku: productData.sku,
      name: productData.name,
      price: productData.price,
      categoryId: productData.categoryId
    });

    // Check if SKU already exists
    const existingProduct = await this.productService.getProductBySku(productData.sku);
    if (existingProduct) {
      addEvent('product.creation.failed', { reason: 'duplicate_sku', sku: productData.sku });
      throw new CustomError('Product with this SKU already exists', 409);
    }

    const product = await this.productService.createProduct(productData);

    addEvent('product.created', { 
      productId: product.id, 
      sku: product.sku, 
      price: product.price 
    });
    addMetric('products.created', 1, ['success']);

    const response: ApiResponse = {
      success: true,
      data: product,
      message: 'Product created successfully'
    };

    res.status(201).json(response);
  });

  getAllProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    datadogLogger.info('Fetching products', { page, limit });

    const result = await this.productService.getAllProducts(page, limit);

    addMetric('products.fetched', result.data.length, ['success']);
    addMetric('products.total', result.pagination.total, ['total']);

    const response: ApiResponse = {
      success: true,
      data: result
    };

    res.status(200).json(response);
  });

  getProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const productId = parseInt(req.params.id as string);

    datadogLogger.info('Fetching product by ID', { productId });

    const product = await this.productService.getProductById(productId);

    if (!product) {
      addEvent('product.fetch.failed', { reason: 'not_found', productId });
      throw new CustomError('Product not found', 404);
    }

    addEvent('product.fetched', { productId, sku: product.sku });

    const response: ApiResponse = {
      success: true,
      data: product
    };

    res.status(200).json(response);
  });

  updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const productId = parseInt(req.params.id as string);
    const updateData: UpdateProductRequest = req.body;

    datadogLogger.info('Updating product', { 
      productId, 
      updateFields: Object.keys(updateData) 
    });

    // Check if SKU already exists (if updating SKU)
    if (updateData.sku) {
      const existingProduct = await this.productService.getProductBySku(updateData.sku);
      if (existingProduct && existingProduct.id !== productId) {
        addEvent('product.update.failed', { reason: 'duplicate_sku', productId, sku: updateData.sku });
        throw new CustomError('Product with this SKU already exists', 409);
      }
    }

    const product = await this.productService.updateProduct(productId, updateData);

    if (!product) {
      addEvent('product.update.failed', { reason: 'not_found', productId });
      throw new CustomError('Product not found', 404);
    }

    addEvent('product.updated', { 
      productId, 
      sku: product.sku,
      updatedFields: Object.keys(updateData)
    });
    addMetric('products.updated', 1, ['success']);

    const response: ApiResponse = {
      success: true,
      data: product,
      message: 'Product updated successfully'
    };

    res.status(200).json(response);
  });

  deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const productId = parseInt(req.params.id as string);

    datadogLogger.info('Deleting product', { productId });

    const deleted = await this.productService.deleteProduct(productId);

    if (!deleted) {
      addEvent('product.delete.failed', { reason: 'not_found', productId });
      throw new CustomError('Product not found', 404);
    }

    addEvent('product.deleted', { productId });
    addMetric('products.deleted', 1, ['success']);

    const response: ApiResponse = {
      success: true,
      message: 'Product deleted successfully'
    };

    res.status(200).json(response);
  });
} 