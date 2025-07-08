import { Request, Response } from "express";
import * as orderService from "../services/orders.service";

export const createOrder = async (req: Request, res: Response):Promise<any> => {
  try {
    const { orderItems } = req?.body;
    const userId = res?.locals?.user?.id;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "Order items are required." });
    }

    const order = await orderService.createOrder(Number(userId), orderItems);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getMyOrders(res?.locals?.user?.id);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await orderService.updateOrderStatus(Number(req?.params?.id), req?.body?.status);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
