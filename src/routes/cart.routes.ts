import {Router} from 'express';
import * as cartController from '../controller/cart.controller';
import { authenticateToken } from '../middlewares/authMiddleware';
import { RBAC } from '../middlewares/rbac';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/create',authenticateToken,RBAC([UserRole.CUSTOMER]),cartController.createCart);
router.get('/getCart',authenticateToken,RBAC([UserRole.CUSTOMER]),cartController.getCart);
router.delete('/remove/:itemId',authenticateToken,RBAC([UserRole.CUSTOMER]),cartController.removeCartItem);
router.delete('/remove',authenticateToken,RBAC([UserRole.CUSTOMER]),cartController.clearCart);

export default router;