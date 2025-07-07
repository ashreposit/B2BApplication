import { Express } from "express";

declare global{
  namespace Express{
    interface Request{
      user:{
        id:number,
        role:string,
        iat:number,
        exp:number
      }
    }
  } 
}