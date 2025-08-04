import { CartService } from '../services/cartService';
import { AddToCartRequest, UpdateCartItemRequest } from '../types';

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
  });

  describe('addToCart', () => {
    it('should throw error for non-existent product', async () => {
      const cartData: AddToCartRequest = {
        productId: 99999,
        quantity: 1
      };

      await expect(cartService.addToCart(cartData)).rejects.toThrow('Product not found');
    });

    it('should throw error for insufficient stock', async () => {
      const cartData: AddToCartRequest = {
        productId: 5,
        quantity: 1000
      };

      await expect(cartService.addToCart(cartData)).rejects.toThrow('Insufficient stock');
    });
  });

  describe('updateCartItem', () => {
    it('should return null for non-existent cart item', async () => {
      const updateData: UpdateCartItemRequest = {
        quantity: 2
      };

      const result = await cartService.updateCartItem(99999, updateData);
      expect(result).toBeNull();
    });
  });

  describe('removeFromCart', () => {
    it('should return false for non-existent cart item', async () => {
      const result = await cartService.removeFromCart(99999);
      expect(result).toBe(false);
    });
  });

  describe('getCart', () => {
    it('should return empty cart when no items', async () => {
      const cart = await cartService.getCart();
      
      expect(cart.items).toEqual([]);
      expect(cart.totalItems).toBe(0);
      expect(cart.totalAmount).toBe(0);
    });
  });
}); 