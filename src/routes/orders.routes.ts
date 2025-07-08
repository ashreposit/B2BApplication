import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import * as orderController from '../controller/orders.controller';
import { RBAC } from '../middlewares/rbac';
import { UserRole } from '@prisma/client';

const router = Router();

router.post("/create", authenticateToken, RBAC([UserRole.CUSTOMER]), orderController.createOrder);
router.get("/", authenticateToken, RBAC([UserRole.ADMIN]), orderController.getAllOrders);
router.get("/getMyOrders", authenticateToken, RBAC([UserRole.CUSTOMER]), orderController.getMyOrders);
router.put("/update/:id", authenticateToken, RBAC([UserRole.CUSTOMER]), orderController.updateOrderStatus);

export default router;