import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";

export const RBAC = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden. You do not have access" });
      return;
    }

    next();
  };
};
