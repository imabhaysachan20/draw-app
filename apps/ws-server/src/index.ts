import { WebSocketServer } from 'ws';
import jwt from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config';
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws,req) {
  const url = req.url;
  if (!url) {
    return;
  }
  const token = new URL(url).searchParams.get('token');
  if (!token) {
    ws.close();
    return;
  }

  const decoded = jwt.verify(token,JWT_SECRET);

  if (!decoded || !decoded.userId) {
    ws.close();
    return;
  }
  ws.on('message', function message(data) {
    ws.send("pong")
  });
});