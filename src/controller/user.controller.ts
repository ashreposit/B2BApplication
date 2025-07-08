import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import CONFIG from '../config/config';

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

export const logout = async (req: Request, res: Response): Promise<any> => {
  console.log({ INFO: "logout function called" });
  res.clearCookie("authorizationToken");
  res.status(200).json({ message: "logged out successfully..." });
};