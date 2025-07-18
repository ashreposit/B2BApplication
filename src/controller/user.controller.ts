import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import CONFIG from '../config/config';

/**
 * Controller to register a new user.
 * 
 * @route POST /auth/register
 * @access Public
 * @param req - Express Request containing user details in body
 * @param res - Express Response object
 * @returns Success message if registration succeeds
 */
export const userCreation = async (req: Request, res: Response): Promise<any> => {
    console.log({ INFO: "userCreation function called" });
  try {
    const userCreation = await userService.createUser(req?.body);
    if (userCreation) {
      return res.status(200).json({ message: 'User registered successfully' });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || 'Error in creating user' });
  }
};


/**
 * Controller to authenticate a user and issue a JWT token via cookie.
 * 
 * @route POST /auth/login
 * @access Public
 * @param req - Express Request containing email and password in body
 * @param res - Express Response object
 * @returns JWT token via cookie if successful, else 401 on invalid credentials
 */
export const login = async (req: Request, res: Response): Promise<any> => {
  console.log({ INFO: "login function called" });
  try {
    const result = await userService.loginUser(req?.body);

    if (result?.authorizationToken) {
      res.cookie('authorizationToken', result.authorizationToken, {
        maxAge: CONFIG.JWT_COOKIE_EXPIRATION,
        httpOnly: true
      });
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || 'Login failed' });
  }
};

/**
 * Controller to get currently logged-in user's details.
 * 
 * @route GET /auth/getMe
 * @access Private (authenticated)
 * @param req - Express Request with authenticated user info in res.locals.user
 * @param res - Express Response object
 * @returns User details of logged-in user
 */
export const getOneUser = async (req: Request, res: Response): Promise<any> => {
  console.log({ INFO: "getOneUser function called" });
  try {
    let userId = res?.locals?.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await userService.getMe(userId);
    return res.status(200).json({ user });

  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || 'Login failed' });
  }
};

/**
 * Controller to update user details.
 * 
 * @route PATCH /auth/update/:userId
 * @access Private (authenticated)
 * @param req - Express Request with userId as param and new data in body
 * @param res - Express Response object
 * @returns Updated user details
 */
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  console.log({ INFO: "updateUser function called" });
  try {
    let userId = req?.params?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await userService.updateUser(userId, req?.body);
    return res.status(200).json({ user });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || 'update failed' });
  }
};

/**
 * Controller to log out the currently authenticated user.
 * 
 * @route POST /auth/logout
 * @access Private (authenticated)
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Success message on logout
 */
export const logout = async (req: Request, res: Response): Promise<any> => {
  console.log({ INFO: "logout function called" });
  res.clearCookie("authorizationToken");
  res.status(200).json({ message: "logged out successfully..." });
};