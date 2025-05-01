import express from 'express'
import jwt from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import {UserLoginSchema,UserSignUpSchema,roomSchema} from "@repo/common/types"
const app = express();

app.post("/signin",async (req,res)=>{
    const data = UserLoginSchema.safeParse(req.body)
    if (!data.success) {
        res.json({
            message:"incorrect input"
        })
        return;
    }
    const token = jwt.sign({
        userId:123
    },JWT_SECRET)
    res.json({
        token
    })
})
app.post("/signup",async (req,res)=>{
    const data = UserSignUpSchema.safeParse(req.body)
    if (!data.success) {
        res.json({
            message:"incorrect input"
        })
        return;
    }
    //db call
    res.json({
        userId:1
    })
})
app.get("/room",middleware,async (req,res)=>{
    const data = roomSchema.safeParse(req.body)
    if (!data.success) {
        res.json({
            message:"incorrect input"
        })
        return;
    }
    res.json({
        roomId:123
    })
    
})

app.listen(3000,()=>{
    console.log("hey")
})