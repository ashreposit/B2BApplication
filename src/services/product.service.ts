import prisma from "../config/prismaClient";

export const createProduct = async (bodyData: { name: string, description: string, price: string, awsImageUrl: string }) => {
    try {
        const product = await prisma.product.create({
            data: {
                name: bodyData?.name,
                description: bodyData?.description,
                price: bodyData?.price,
                imageUrl: bodyData?.awsImageUrl || null
            }
        });

        if (!product) throw new Error('product creation failed');

        return { product };
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }
};

export const getAllProducts = async () => {
    try {
        const products = await prisma.product.findMany();
        if (!products) throw new Error('No products found');
        return { products };
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }
};

export const getProductById = async (id: number) => {
    try {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) throw new Error('Product not found');
        return { product };
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }
};

export const updateProduct = async (id: number, data: any) => {
    try {
        const product = await prisma.product.update({
            where: { id },
            data,
        });

        if (!product) throw new Error('updation failed');
        return { product };
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }
};

export const deleteProduct = async (id: number) => {
    try {
        const product = await prisma.product.delete({ where: { id } });
        if (!product) throw new Error('product deletion failed');
        return { product };
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }
};