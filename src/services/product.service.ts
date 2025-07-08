import prisma from "../config/prismaClient";

/**
 * Creates a new product.
 * 
 * @param bodyData - Object containing name, description, price, and optional awsImageUrl
 * @returns The created product object
 * @throws Error if product creation fails
 */
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

/**
 * Retrieves all products in the system.
 * 
 * @returns List of all products
 * @throws Error if no products found
 */
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

/**
 * Retrieves a product by its ID.
 * 
 * @param id - The product ID to fetch
 * @returns The product if found
 * @throws Error if product not found
 */
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

/**
 * Updates an existing product by its ID.
 * 
 * @param id - The product ID to update
 * @param data - Object containing fields to update (name, description, price, imageUrl etc.)
 * @returns The updated product
 * @throws Error if update operation fails
 */
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

/**
 * Deletes a product by its ID.
 * 
 * @param id - The product ID to delete
 * @returns The deleted product
 * @throws Error if deletion fails
 */
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