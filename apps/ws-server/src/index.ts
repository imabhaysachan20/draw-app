import { WebSocket, WebSocketServer } from 'ws';
import { verifyToken } from './utils/functions';
import {db} from "@repo/db/client"
const wss = new WebSocketServer({ port: 8080 });

interface User {
  rooms:string[],
  userId:string,
  ws:WebSocket
}

const users:User[] = []


wss.on('connection', function connection(ws,req) {
  const url = req.url;
  if (!url) {
    return;
  }
  const token = new URL(url,'ws://localhost:8080').searchParams.get('token') || "";
  const userId = verifyToken(token);

  if (!userId) {
    console.log("no user id")
    ws.close();
    return;
  }
  users.push({
    ws,
    userId,
    rooms:[]
  })
  ws.on('message', async function message(data) {
    
    
    const parsedData = JSON.parse(data as unknown as string);
    const user = users.find(user=>user.ws==ws);
    if (parsedData.type=="join_room") {
      user?.rooms.push(parsedData.roomId)
    }
    
    if (parsedData.type=="leave_room") {  
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((r)=>r!=parsedData.room)
    }
   
    if (parsedData.type=="chat") {
       await db.Chat.create({
      data:{
      roomId:Number(parsedData.roomId),
      message:parsedData.message,
      userId:userId

      }
    })
     users.forEach((user)=>{
      if (user.rooms.includes(parsedData.roomId)) {

        

        user.ws.send(JSON.stringify({
          "type":"chat",
          "message":parsedData.message,
          roomId:parsedData.roomId
        }))
      }
     })
    }
  });
});