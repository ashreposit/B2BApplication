import { Request, Response } from "express";
import * as cartService from '../services/cart.service';

/**
 * Controller to create a new cart for a user and add multiple cart items.
 * 
 * @route POST /cart
 * @access Customer (authenticated)
 * @param req - Express Request object containing cartItems in body
 * @param res - Express Response object
 * @returns Created cart with its cartItems
 */
export const createCart = async (req: Request, res: Response):Promise<any> => {
    try {
        const { cartItems } = req?.body;
        const userId = res?.locals?.user?.id;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "cart items are required." });
        }

        const order = await cartService.createCart(Number(userId), cartItems);
        res.status(201).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Controller to fetch the current user's cart along with its cart items and product details.
 * 
 * @route GET /cart
 * @access Customer (authenticated)
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Cart with its cartItems and products
 */
export const getCart = async (req: Request, res: Response):Promise<any> => {
    try {
        const userId = res?.locals?.user?.id;

        const order = await cartService.getCart(Number(userId));
        res.status(201).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Controller to remove a specific cart item by its ID.
 * 
 * @route DELETE /cart/item/:itemId
 * @access Customer (authenticated)
 * @param req - Express Request object containing itemId param
 * @param res - Express Response object
 * @returns Deleted cartItem object
 */
export const removeCartItem = async (req: Request, res: Response):Promise<any> => {
    try {
        const itemId = req?.params?.itemId;
        console.log({itemId});
        const cartItem = await cartService.removeCartItem(Number(itemId));
        res.status(201).json(cartItem);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Controller to clear (delete all items) from the current user's cart.
 * 
 * @route DELETE /cart/clear
 * @access Customer (authenticated)
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Success message confirming cart clearance
 */
export const clearCart = async (req: Request, res: Response):Promise<any> => {
    try {
        const userId = res?.locals?.user?.id;

        const cart = await cartService.clearCart(Number(userId));
        res.status(201).json(cart);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

