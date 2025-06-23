import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config';
export function verifyToken(token:string):(string|null) {
  if (!token) {
    return null;
  }
  let decoded;
  try {
  decoded = jwt.verify(token,JWT_SECRET);
  }
  catch (e) {
    console.log(e)
    return null;
  }
  if (!decoded || !(decoded as JwtPayload).id) {
    return null;
  }
  
    return (decoded as JwtPayload).id;
}

