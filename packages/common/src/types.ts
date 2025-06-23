import {z} from "zod"

export const UserLoginSchema = z.object(
    {
        username:z.string().min(2).max(10),
        password:z.string().min(8)
    }
)
export const UserSignUpSchema = z.object(
    {
        username:z.string().min(2).max(20),
        email:z.string(),
        password:z.string().min(8)
    }
)
export const roomSchema = z.object(
    {
        roomId:z.string()
    }
)