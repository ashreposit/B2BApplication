import { Request, Response } from 'express';
import * as productService from '../services/product.service';

/**
 * Controller to create a new product.
 * 
 * @route POST /products
 * @access Admin (authenticated + authorized)
 * @param req - Express Request containing product details in body
 * @param res - Express Response object
 * @returns The created product
 */
export const createProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const productcreation = await productService.createProduct(req?.body);

        if (productcreation) {
            return res.status(200).json({ message: 'product created successfully', product: productcreation });
        }
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({ message: error.message || 'Error in creating product' });
    }
};


/**
 * Controller to fetch all products.
 * 
 * @route GET /products
 * @access Public
 * @param _req - Express Request object (not used)
 * @param res - Express Response object
 * @returns List of all products
 */
export const getAllProducts = async (_req: Request, res: Response): Promise<any> => {
    try {
        const products = await productService.getAllProducts();
        if (products) return res.status(200).json(products);
    } catch (error: any) {
        console.log(error);
        return res.status(400).json({ message: error.message || 'Error in getting all product' });
    }
};

/**
 * Controller to fetch a product by its ID.
 * 
 * @route GET /products/:id
 * @access Public
 * @param req - Express Request containing productId as param
 * @param res - Express Response object
 * @returns The product if found, 404 if not
 */
export const getProductById = async (req: Request, res: Response): Promise<any> => {
    try {
        const product = await productService.getProductById(Number(req?.params?.id));
        if (product) return res.status(200).json(product);
        if (!product) return res.status(404).json({ message: "Product not found" });
    } catch (error: any) {
        console.log(error);
        return res.status(400).json({ message: error.message || 'Error in getting product' });
    }
};

/**
 * Controller to update a product by its ID.
 * 
 * @route PATCH /products/:id
 * @access Admin (authenticated + authorized)
 * @param req - Express Request containing productId as param and updated details in body
 * @param res - Express Response object
 * @returns The updated product
 */
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const product = await productService.updateProduct(Number(req.params.id), req?.body);
        res.status(200).json({ message: "Product updated", product });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

/**
 * Controller to delete a product by its ID.
 * 
 * @route DELETE /products/:id
 * @access Admin (authenticated + authorized)
 * @param req - Express Request containing productId as param
 * @param res - Express Response object
 * @returns Success message on deletion
 */
export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const product = await productService.deleteProduct(Number(req.params.id));
        if (product) res.status(200).json({ message: "Product deleted" });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};