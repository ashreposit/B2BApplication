import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { getOneUser, login, userCreation } from '../controller/user.controller';
import { RBAC } from '../middlewares/rbac';
import { UserRole } from '@prisma/client';
import { upload } from '../config/fileManagement';

const router = Router();

router.post('/create',upload.single("UserImage"),userCreation);
router.post('/login',login);
router.get('/getMe', authenticateToken, RBAC([UserRole.ADMIN, UserRole.CUSTOMER]), getOneUser);

export default router;