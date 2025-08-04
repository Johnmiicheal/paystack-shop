import Joi from 'joi';

// Product validation schemas
export const createProductSchema = Joi.object({
  sku: Joi.string()
    .pattern(/^[A-Z0-9-]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'SKU must contain only uppercase letters, numbers, and hyphens',
      'string.min': 'SKU must be at least 3 characters long',
      'string.max': 'SKU must not exceed 50 characters',
      'any.required': 'SKU is required'
    }),
  name: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'Product name must not be empty',
      'string.max': 'Product name must not exceed 255 characters',
      'any.required': 'Product name is required'
    }),
  description: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Product description must not be empty',
      'string.max': 'Product description must not exceed 1000 characters',
      'any.required': 'Product description is required'
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .max(999999.99)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be greater than 0',
      'number.precision': 'Price must have at most 2 decimal places',
      'number.max': 'Price must not exceed 999,999.99',
      'any.required': 'Price is required'
    }),
  stockLevel: Joi.number()
    .integer()
    .min(0)
    .max(999999)
    .required()
    .messages({
      'number.base': 'Stock level must be a number',
      'number.integer': 'Stock level must be a whole number',
      'number.min': 'Stock level cannot be negative',
      'number.max': 'Stock level must not exceed 999,999',
      'any.required': 'Stock level is required'
    }),
  categoryId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Category ID must be a number',
      'number.integer': 'Category ID must be a whole number',
      'number.positive': 'Category ID must be greater than 0',
      'any.required': 'Category ID is required'
    })
});

export const updateProductSchema = Joi.object({
  sku: Joi.string()
    .pattern(/^[A-Z0-9-]+$/)
    .min(3)
    .max(50)
    .optional()
    .messages({
      'string.pattern.base': 'SKU must contain only uppercase letters, numbers, and hyphens',
      'string.min': 'SKU must be at least 3 characters long',
      'string.max': 'SKU must not exceed 50 characters'
    }),
  name: Joi.string()
    .min(1)
    .max(255)
    .optional()
    .messages({
      'string.min': 'Product name must not be empty',
      'string.max': 'Product name must not exceed 255 characters'
    }),
  description: Joi.string()
    .min(1)
    .max(1000)
    .optional()
    .messages({
      'string.min': 'Product description must not be empty',
      'string.max': 'Product description must not exceed 1000 characters'
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .max(999999.99)
    .optional()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be greater than 0',
      'number.precision': 'Price must have at most 2 decimal places',
      'number.max': 'Price must not exceed 999,999.99'
    }),
  stockLevel: Joi.number()
    .integer()
    .min(0)
    .max(999999)
    .optional()
    .messages({
      'number.base': 'Stock level must be a number',
      'number.integer': 'Stock level must be a whole number',
      'number.min': 'Stock level cannot be negative',
      'number.max': 'Stock level must not exceed 999,999'
    }),
  categoryId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'Category ID must be a number',
      'number.integer': 'Category ID must be a whole number',
      'number.positive': 'Category ID must be greater than 0'
    })
});

// Cart validation schemas
export const addToCartSchema = Joi.object({
  productId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Product ID must be a number',
      'number.integer': 'Product ID must be a whole number',
      'number.positive': 'Product ID must be greater than 0',
      'any.required': 'Product ID is required'
    }),
  quantity: Joi.number()
    .integer()
    .positive()
    .max(100)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be a whole number',
      'number.positive': 'Quantity must be greater than 0',
      'number.max': 'Quantity must not exceed 100',
      'any.required': 'Quantity is required'
    })
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .positive()
    .max(100)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be a whole number',
      'number.positive': 'Quantity must be greater than 0',
      'number.max': 'Quantity must not exceed 100',
      'any.required': 'Quantity is required'
    })
});

// Pagination validation schema
export const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .positive()
    .max(1000)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be a whole number',
      'number.positive': 'Page must be greater than 0',
      'number.max': 'Page must not exceed 1000'
    }),
  limit: Joi.number()
    .integer()
    .positive()
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be a whole number',
      'number.positive': 'Limit must be greater than 0',
      'number.max': 'Limit must not exceed 100'
    })
});

// ID validation schema
export const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be a whole number',
      'number.positive': 'ID must be greater than 0',
      'any.required': 'ID is required'
    })
});

export const itemIdParamSchema = Joi.object({
  itemId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Item ID must be a number',
      'number.integer': 'Item ID must be a whole number',
      'number.positive': 'Item ID must be greater than 0',
      'any.required': 'Item ID is required'
    })
}); 