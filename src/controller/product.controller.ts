import { Request, Response } from 'express';
import * as productService from '../services/product.service';

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

export const getAllProducts = async (_req: Request, res: Response): Promise<any> => {
    try {
        const products = await productService.getAllProducts();
        if (products) return res.status(200).json(products);
    } catch (error: any) {
        console.log(error);
        return res.status(400).json({ message: error.message || 'Error in getting all product' });
    }
};

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

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const product = await productService.updateProduct(Number(req.params.id), req?.body);
        res.status(200).json({ message: "Product updated", product });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const product = await productService.deleteProduct(Number(req.params.id));
        if (product) res.status(200).json({ message: "Product deleted" });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};