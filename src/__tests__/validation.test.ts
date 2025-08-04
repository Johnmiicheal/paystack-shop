import { Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validation';
import { createProductSchema } from '../validation/schemas';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('validate', () => {
    it('should pass validation for valid data', () => {
      mockRequest.body = {
        sku: 'TEST-001',
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stockLevel: 10,
        categoryId: 1
      };

      validate(createProductSchema)(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.body).toEqual(mockRequest.body);
    });

    it('should fail validation for invalid SKU', () => {
      mockRequest.body = {
        sku: 'invalid-sku',
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stockLevel: 10,
        categoryId: 1
      };

      validate(createProductSchema)(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('SKU must contain only uppercase letters')
      }));
    });

    it('should fail validation for missing required fields', () => {
      mockRequest.body = {
        sku: 'TEST-001',
        name: 'Test Product'
        // Missing required fields
      };

      validate(createProductSchema)(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Validation failed')
      }));
    });

    it('should fail validation for invalid price', () => {
      mockRequest.body = {
        sku: 'TEST-001',
        name: 'Test Product',
        description: 'A test product',
        price: -10,
        stockLevel: 10,
        categoryId: 1
      };

      validate(createProductSchema)(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Price must be greater than 0')
      }));
    });
  });
}); 