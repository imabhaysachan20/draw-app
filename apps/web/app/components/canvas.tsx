"use client"
import { initDraw } from "@/draw"
import { useRef,useEffect, useState, useContext } from "react"
import { WS_URL } from "../config";
import Topbar from "./topbar";
import { ShapeContext } from "@/contexts/shapeContext";




function Canvas({roomId}:{roomId:string}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [socket,setSocket] = useState<WebSocket|null>(null);
    const context = useContext(ShapeContext);
    if (!context) {
      return;
    }
    useEffect(()=>{
      // @ts-ignore
      window.currentShape = context.shape
    },[context.shape])
    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiZjBkMmQ5LTlmMjEtNDRmMS04YzU2LTNlNWQ5NzM2ZWRlOCIsInVzZXJuYW1lIjoiYWJoYXkyMyIsImlhdCI6MTc1MDY0OTIxNCwiZXhwIjoxNzUxMjU0MDE0fQ.HBEmhIAm5YxgqUPVXRRc_Oay6w_MN0FIkgKDiMYhbz4`);
      ws.onopen = (e)=>{
            console.log("open")
            ws.send(JSON.stringify({
              type:"join_room",
              roomId
            }))
            
        }        
  ws.onclose = (e)=>{
            console.log(e)
        }        
  ws.onerror = (e)=>{
            console.log(e)
        }        
        setSocket(ws)
        return ()=>{
          ws.close()
        }
    },[])


    useEffect(()=>{
        if(canvasRef.current && socket) {
            initDraw(canvasRef.current,roomId,socket)
        }
    },[canvasRef,socket])

    if (!socket) {
        return <div>
            Connecting to the server...
        </div>
    }
  return (
    <div className='h-screen overflow-hidden'>
        <Topbar/>
        <canvas className='border border-red-200' height={window.innerHeight} width={window.innerWidth} ref={canvasRef}>
        </canvas>
    </div>
  )
}

export default Canvas