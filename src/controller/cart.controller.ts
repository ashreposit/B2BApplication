import { Request, Response } from "express";
import * as cartService from '../services/cart.service';

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

export const getCart = async (req: Request, res: Response):Promise<any> => {
    try {
        const userId = res?.locals?.user?.id;

        const order = await cartService.getCart(Number(userId));
        res.status(201).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

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

export const clearCart = async (req: Request, res: Response):Promise<any> => {
    try {
        const userId = res?.locals?.user?.id;

        const cart = await cartService.clearCart(Number(userId));
        res.status(201).json(cart);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

