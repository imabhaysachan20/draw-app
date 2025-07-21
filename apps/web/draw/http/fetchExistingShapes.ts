import { BACKEND_URL } from "@/app/config";
import axios from "axios";


export default async function fetch(roomId:string) {
  try {
    const resp = await axios.get(`${BACKEND_URL}/chat/${roomId}`) ;
    return resp.data.messages.map((s:any)=>JSON.parse(s.message));
    }
    catch(e) {
        console.log(e)
    }
}