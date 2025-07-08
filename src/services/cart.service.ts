import prisma from "../config/prismaClient";

export const createCart = async (userId: number, cartItems: any[]) => {
    try {
        const productIds = cartItems.map((item) => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });
        console.log({products});
        console.log({cartItems});
        if (products.length !== cartItems.length) {
            throw new Error("Some products not found.");
        }

        const cart = await prisma.cart.create({
            data: {
                userId,
                cartItems: {
                    create: cartItems.map((item) => {
                        const product = products.find((p) => p.id === item.productId);
                        return {
                            productId: product!.id,
                            quantity: item.quantity,
                        };
                    })
                }
            },
            include: { cartItems: true }
        });

        return cart;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getCart = async (userId: number) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart) {
            throw new Error("Cart not found for this user.");
        }

        return cart;
    } catch (error: any) {
        console.error("Error fetching cart:", error.message);
        throw new Error(error.message);
    }
};

export const removeCartItem = async (itemId: number) => {
    try {
        console.log({itemId});
        const item = await prisma.cartItem.delete({ where: { id: itemId } });

        return item;
    } catch (error: any) {
        console.error("Error removing item from cart:", error.message);
        throw new Error(error.message);
    }
};

export const clearCart = async (userId: number) => {
    try {
        const cart = await prisma.cart.findUnique({ where: { id: userId } });

        if (!cart) throw new Error('No cart found for this user');

        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        return { message: "Cart cleared successfully." };
    } catch (error: any) {
        console.error("Error clearing cart:", error.message);
        throw new Error(error.message);
    }
};