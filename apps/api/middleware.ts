import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

export const authMiddlware=(req:Request, res:Response, next:NextFunction)=>{
    const token = req.headers["authorization"]

    if(!token){
        res.status(411).json({
            msg : "token is not present"
        })
        return 
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!,(err,decoded:any )=>{
        if(err){
            res.status(403).json({
                msg : "token invalid"
            })
            return 
        }
        req.userId = decoded.token
        next()
        return 
    })
    
}