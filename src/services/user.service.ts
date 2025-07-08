import prisma from "../config/prismaClient";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CONFIG from "../config/config";
import { UserRole } from "@prisma/client";

export const createUser = async (bodyData: { email: string, password: string, role: UserRole, awsImageUrl: string }) => {
  try {
    const { email, password, role, awsImageUrl } = bodyData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const saltRounds = Math.floor(Math.random() * (12 - 8 + 1)) + 8;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
        userImage: awsImageUrl || null
      }
    });

    return { user: createdUser };

  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Error in creating user");
  }
};

export const loginUser = async (bodyData: { email: string, password: string }) => {
  try {
    const { email, password } = bodyData;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new Error('Invalid email or password');

    const authorizationToken = jwt.sign(
      { id: user.id, role: user.role },
      CONFIG.JWT_SECRET_KEY,
      { expiresIn: CONFIG.JWT_EXPIRATION }
    );

    return { authorizationToken };

  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || 'Login failed');
  }
};

export const getMe = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }, select: {
        id: true,
        email: true,
        role: true,
        userImage: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) throw new Error('User not found');
    return user;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }

};

export const updateUser = async (userId: string, bodyData: { email?: string; awsImageUrl?: string }) => {
  try {
    let id = Number(userId);

    const user = await prisma.user.update({
      where: { id: id }, data: {
        email: bodyData?.email,
        userImage: bodyData?.awsImageUrl,
        updatedAt: new Date()
      }
    });

    if (!user) throw new Error('user updation failed');
    return user;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};