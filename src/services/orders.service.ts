import prisma from "../config/prismaClient";

export const createOrder = async (userId: number, orderItems: any[]) => {
    try {
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
