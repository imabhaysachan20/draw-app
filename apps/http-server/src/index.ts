import express from 'express'
import jwt from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import {UserLoginSchema,UserSignUpSchema,roomSchema} from "@repo/common/types"
import cors from "cors"
import {db} from "@repo/db/client"
import bcrypt from "bcryptjs";
const app = express();
app.use(express.json())
app.use(cors())
app.post("/signin",async (req,res)=>{
    const data = UserLoginSchema.safeParse(req.body)
    
    if (!data.success) {
        res.json({
            message:"incorrect input"
        })
        return;
    }
    const parsedData = data.data;
    const {username,password} = parsedData;
    try {
    const user = await db.User.findUnique({
      where: { name: username },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(403).json({
        success: false,
        message: "Wrong password",
    });
    return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
    },
    
});

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }

    
    
})
app.post("/signup",async (req,res)=>{
    
    const data = UserSignUpSchema.safeParse(req.body)
    if (!data.success) {
        res.json({
            message:"incorrect input"
        })
        return;
    }
    const parsedData = data.data;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(parsedData.password, salt);
    try {
        
const existingUser = await db.User.findFirst({
  where: {
    OR: [
      { email: parsedData.email },
      { name: parsedData.username }, // name is your username
    ],
  },
});

if (existingUser) {
  res.status(400).json({ error: 'Email or username already in use' });
  return;
}

   const user = await db.User.create({
    data: {
        email: parsedData.email,
        password: hash,
        name: parsedData.username
    }
})
 const {password,...restUser} = user;
res.json({
        sucess:true,
        data:{
            ...restUser
        }
    })
    
}
    catch(e) {
        console.log(e);
    }

    
})
app.get("/room",middleware,async (req,res)=>{
    const data = roomSchema.safeParse(req.body)
    if (!data.success) {
        res.json({
            message:"incorrect input"
        })
        return;
    }
    //@ts-ignore
    const userId = req.userId;
    console.log(userId);
    let room;
    try{
    room =  await db.Room.create({
      data:{
        slug:data.data.roomId,
        adminId:userId
      }
    })
  }
  catch(e) {
    res.status(400).json({
      message:"room already exist"
    })
    return;
  }
    res.json({
      roomId:room.id
    })
})

app.get("/chat/:roomid",async (req,res)=>{
  const roomId = Number(req.params.roomid);
  console.log(roomId)
  const messages = await db.Chat.findMany({
    where:{
      roomId
    },
    orderBy:{
      id:"desc"
    },
    take:50 
  })
  res.json({
    messages
  })
})


app.listen(3001,()=>{
    console.log("up at 3001")
})