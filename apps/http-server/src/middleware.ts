import { NextFunction, Request, Response } from "express";
import jwt  from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
export function middleware(req:Request,res:Response,next:NextFunction) {
    const authHeader = req.headers['authorization'] ?? "";
    const token = authHeader.startsWith("Bearer") ? authHeader.split(" ")[1] ?? "" : "";
    let decoded;
    if (!token) {
        res.status(400).json({
            sucess:false,
            message:"no token providied"
        })
        return;
    }
    try {
    decoded = jwt.verify(token,JWT_SECRET)
    }
    catch(e) {
        res.status(401).json({
            success:false,
            message:"invalid token"
        })
        return
    }

    if (decoded) {
        //@ts-ignore: TODO: Fix this??
        req.userId = decoded.id

        next();
    }
    else {
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}