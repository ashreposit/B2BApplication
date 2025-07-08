import { Request, Response } from "express";
import * as orderService from "../services/orders.service";

/**
 * Controller to create a new order for a customer.
 * 
 * @route POST /orders
 * @access Customer (authenticated)
 * @param req - Express Request containing orderItems in the body
 * @param res - Express Response object
 * @returns The created order with order items
 */
export const createOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderItems } = req?.body;
    const userId = res?.locals?.user?.id;

    const order = await orderService.createOrder(Number(userId), orderItems);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to fetch the logged-in customer's order history.
 * 
 * @route GET /orders/my-orders
 * @access Customer (authenticated)
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns List of orders for the logged-in customer
 */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getMyOrders(res?.locals?.user?.id);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to fetch all orders for admin users.
 * 
 * @route GET /orders
 * @access Admin (authenticated + authorized)
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns List of all orders including user and product details
 */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to update the status of a specific order.
 * 
 * @route PATCH /orders/:id
 * @access Admin (authenticated + authorized)
 * @param req - Express Request containing order ID as param and new status in body
 * @param res - Express Response object
 * @returns Updated order with new status
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await orderService.updateOrderStatus(Number(req?.params?.id),req?.body?.status);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
