import { Request,Response,NextFunction} from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import CONFIG from "../config/config";

interface CustomJwtPayload extends JwtPayload {
  id: number;
  role: string;
  iat:number;
  exp:number;
}

export const authenticateToken = async function(req:Request ,res:Response,next:NextFunction): Promise<any>{

    const token = req?.cookies?.authorizationToken;
    if(!token) return res.status(400).json({message:"Invalid token.Access denied"});

    try {
        let verifiedUser = await jwt.verify(token,CONFIG.JWT_SECRET_KEY);
        if(!verifiedUser) throw new Error('Authentication failed');

        if(verifiedUser){
            res.locals.user = verifiedUser as CustomJwtPayload;
        }
        next();
    } catch (error) {
        res.status(400).json({message:"Invalid token"});
    }
};