import prisma from "../config/prismaClient";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CONFIG from "../config/config";
import { UserRole } from "@prisma/client";

/**
 * Creates a new user account.
 * 
 * @param bodyData - Object containing email, password, role, and optional awsImageUrl
 * @returns The newly created user object
 * @throws Error if user exists or on creation failure
 */
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

/**
 * Authenticates a user with email and password.
 * @param bodyData - Object containing email and password
 * @returns JWT token if login is successful
 * @throws Error if credentials are invalid
 */
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


/**
 * Retrieves a user's own profile by user ID.
 * 
 * @param userId - User's ID to fetch details for
 * @returns User details object
 * @throws Error if user not found
 */
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


/**
 * Updates user details like email and image URL.
 * 
 * @param userId - ID of the user to update
 * @param bodyData - Object containing optional email and awsImageUrl
 * @returns Updated user object
 * @throws Error if update fails
 */
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