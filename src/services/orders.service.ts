import prisma from "../config/prismaClient";

/**
 * Creates a new order for a customer.
 * 
 * @param userId - ID of the customer placing the order
 * @param orderItems - Array of productId and quantity
 * @returns The created order with its order items
 */
export const createOrder = async (userId: number, orderItems: any[]) => {
  try {

    if (!orderItems || orderItems.length === 0) {
      throw new Error("Order items are required.");
    }

    const productIds = orderItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length !== orderItems.length) {
      throw new Error("Some products not found.");
    }

    const totalAmount = orderItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product!.price.toNumber() * item.quantity);
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        items: {
          create: orderItems.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product!.price.toNumber(),
            };
          }),
        },
      },
      include: { items: true },
    });

    return order;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

/**
 * Fetches all orders placed by a specific customer.
 * 
 * @param userId - ID of the customer
 * @returns List of orders with associated order items and product details
 */
export const getMyOrders = async (userId: number) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error: any) {
    console.error("Error fetching my orders:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Fetches all orders in the system (for Admins).
 * 
 * @returns List of all orders with user, items, and product info
 */
export const getAllOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, email: true, role: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error: any) {
    console.error("Error fetching all orders:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Updates the status of an order (Admin only).
 * 
 * Allowed statuses: 'PENDING', 'FULFILLED', 'CANCELLED'
 * 
 * @param orderId - ID of the order to update
 * @param status - New status to set
 * @returns The updated order
 */
export const updateOrderStatus = async (orderId: number, status: any) => {
  try {
    const validStatuses = ["PENDING", "FULFILLED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid order status.");
    }

    let order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return order;
  }
  catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
