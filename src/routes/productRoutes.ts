import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { validate } from '../middleware/validation';
import { 
  createProductSchema, 
  updateProductSchema, 
  paginationSchema, 
  idParamSchema 
} from '../validation/schemas';

const router = Router();
const productController = new ProductController();

// Product routes
router.post('/', validate(createProductSchema), productController.createProduct);
router.get('/', validate(paginationSchema, 'query'), productController.getAllProducts);
router.get('/:id', validate(idParamSchema, 'params'), productController.getProductById);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', validate(idParamSchema, 'params'), productController.deleteProduct);

export default router; 