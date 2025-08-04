import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { CustomError } from './errorHandler';
import logger from '../utils/logger';

export const validate = (schema: Schema, location: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[location];
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      logger.warn('Validation failed', {
        path: req.path,
        method: req.method,
        ip: req.ip,
        validationErrors,
        data: location === 'body' ? { ...req.body, password: '[REDACTED]' } : req[location]
      });

      const errorMessage = validationErrors.map(err => `${err.field}: ${err.message}`).join(', ');
      throw new CustomError(`Validation failed: ${errorMessage}`, 400);
    }

    // Replace the request data with validated data
    req[location] = value;
    next();
  };
};

export const validateId = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params[paramName] as string);
    
    if (isNaN(id) || id <= 0) {
      logger.warn('Invalid ID parameter', {
        path: req.path,
        method: req.method,
        ip: req.ip,
        paramName,
        value: req.params[paramName]
      });
      
      throw new CustomError(`Invalid ${paramName}: must be a positive integer`, 400);
    }
    
    next();
  };
}; 