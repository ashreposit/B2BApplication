import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import * as productController from '../controller/product.controller';
import { RBAC } from '../middlewares/rbac';
import { UserRole } from '@prisma/client';
import { upload } from '../config/fileManagement';

const router = Router();

router.post("/create", authenticateToken, RBAC([UserRole.ADMIN]), upload.single("productImage"), productController.createProduct);
router.get("/", authenticateToken, RBAC([UserRole.ADMIN]), productController.getAllProducts);
router.get("/getOne/:id", authenticateToken, RBAC([UserRole.ADMIN]), productController.getProductById);
router.put("/update/:id", authenticateToken, RBAC([UserRole.ADMIN]), upload.single("productImage"), productController.updateProduct);
router.delete("/delete/:id", authenticateToken, RBAC([UserRole.ADMIN]), productController.deleteProduct);

export default router;