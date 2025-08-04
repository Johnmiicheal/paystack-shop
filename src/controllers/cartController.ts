import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cartService';
import { ApiResponse, AddToCartRequest, UpdateCartItemRequest } from '../types';
import { asyncHandler, CustomError } from '../middleware/errorHandler';
import { datadogLogger, addMetric, addEvent } from '../utils/datadog';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  addToCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cartData: AddToCartRequest = req.body;

    datadogLogger.info('Adding item to cart', {
      productId: cartData.productId,
      quantity: cartData.quantity
    });

    try {
      const cartItem = await this.cartService.addToCart(cartData);

      addEvent('cart.item.added', {
        productId: cartData.productId,
        quantity: cartData.quantity,
        cartItemId: cartItem?.id
      });
      addMetric('cart.items.added', 1, ['success']);

      const response: ApiResponse = {
        success: true,
        data: cartItem,
        message: 'Item added to cart successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        addEvent('cart.item.add.failed', {
          reason: error.message,
          productId: cartData.productId,
          quantity: cartData.quantity
        });
        throw new CustomError(error.message, 400);
      }
      throw error;
    }
  });

  getCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    datadogLogger.info('Fetching cart');

    const cart = await this.cartService.getCart();

    addEvent('cart.fetched', {
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,
      itemCount: cart.items.length
    });
    addMetric('cart.items.total', cart.totalItems, ['total']);
    addMetric('cart.amount.total', cart.totalAmount, ['total']);

    const response: ApiResponse = {
      success: true,
      data: cart
    };

    res.status(200).json(response);
  });

  updateCartItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const itemId = parseInt(req.params.itemId as string);
    const updateData: UpdateCartItemRequest = req.body;

    datadogLogger.info('Updating cart item', {
      itemId,
      newQuantity: updateData.quantity
    });

    try {
      const cartItem = await this.cartService.updateCartItem(itemId, updateData);

      if (!cartItem) {
        addEvent('cart.item.update.failed', { reason: 'not_found', itemId });
        throw new CustomError('Cart item not found', 404);
      }

      addEvent('cart.item.updated', {
        itemId,
        productId: cartItem.productId,
        newQuantity: updateData.quantity
      });
      addMetric('cart.items.updated', 1, ['success']);

      const response: ApiResponse = {
        success: true,
        data: cartItem,
        message: 'Cart item updated successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        addEvent('cart.item.update.failed', {
          reason: error.message,
          itemId,
          newQuantity: updateData.quantity
        });
        throw new CustomError(error.message, 400);
      }
      throw error;
    }
  });

  removeFromCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const itemId = parseInt(req.params.itemId as string);

    datadogLogger.info('Removing item from cart', { itemId });

    const removed = await this.cartService.removeFromCart(itemId);

    if (!removed) {
      addEvent('cart.item.remove.failed', { reason: 'not_found', itemId });
      throw new CustomError('Cart item not found', 404);
    }

    addEvent('cart.item.removed', { itemId });
    addMetric('cart.items.removed', 1, ['success']);

    const response: ApiResponse = {
      success: true,
      message: 'Item removed from cart successfully'
    };

    res.status(200).json(response);
  });

  clearCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    datadogLogger.info('Clearing cart');

    await this.cartService.clearCart();

    addEvent('cart.cleared');
    addMetric('cart.cleared', 1, ['success']);

    const response: ApiResponse = {
      success: true,
      message: 'Cart cleared successfully'
    };

    res.status(200).json(response);
  });
} 