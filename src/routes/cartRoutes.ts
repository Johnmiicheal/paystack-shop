import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { validate } from '../middleware/validation';
import { 
  addToCartSchema, 
  updateCartItemSchema, 
  itemIdParamSchema 
} from '../validation/schemas';

const router = Router();
const cartController = new CartController();

// Cart routes
router.post('/items', validate(addToCartSchema), cartController.addToCart);
router.get('/', cartController.getCart);
router.put('/items/:itemId', validate(itemIdParamSchema, 'params'), validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/items/:itemId', validate(itemIdParamSchema, 'params'), cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router; 