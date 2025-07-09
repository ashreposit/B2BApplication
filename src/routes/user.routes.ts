import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import * as userController from '../controller/user.controller';
import { RBAC } from '../middlewares/rbac';
import { UserRole } from '@prisma/client';
import { upload } from '../config/fileManagement';
import { validate } from "../middlewares/Validator";
import userValidator from './validator/user.validator';

const router = Router();

router.post('/create', upload.single("UserImage"),validate,userValidator.createUser, userController.userCreation);
router.post('/login',validate,userValidator.loginUser, userController.login);
router.get('/getMe', authenticateToken, RBAC([UserRole.ADMIN, UserRole.CUSTOMER]), userController.getOneUser);
router.put('/update/:userId', authenticateToken, RBAC([UserRole.ADMIN, UserRole.CUSTOMER]),validate,userValidator.updateUser, upload.single("UserImage"), userController.updateUser);
router.post("/logout", authenticateToken, RBAC([UserRole.ADMIN, UserRole.CUSTOMER]), userController.logout);

export default router;