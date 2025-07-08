import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import * as userController from '../controller/user.controller';
import { RBAC } from '../middlewares/rbac';
import { UserRole } from '@prisma/client';
import { upload } from '../config/fileManagement';

const router = Router();

router.post('/create', upload.single("UserImage"), userController.userCreation);
router.post('/login', userController.login);
router.get('/getMe', authenticateToken, RBAC([UserRole.ADMIN, UserRole.CUSTOMER]), userController.getOneUser);
router.put('/update/:userId', authenticateToken, RBAC([UserRole.ADMIN, UserRole.CUSTOMER]), upload.single("UserImage"), userController.updateUser);
router.post("/logout", authenticateToken, RBAC([UserRole.ADMIN, UserRole.CUSTOMER]), userController.logout);

export default router;