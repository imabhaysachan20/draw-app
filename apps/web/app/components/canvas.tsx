"use client"
import { initDraw } from "@/draw"
import { useRef,useEffect, useState } from "react"
import { WS_URL } from "../config";


function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [socket,setSocket] = useState<WebSocket|null>(null);
    
    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=`);
        ws.onopen = ()=>{
            
        }
    },[socket])
    useEffect(()=>{
        if(canvasRef.current) {
            initDraw(canvasRef.current)
        }
    },[canvasRef])

    if (!socket) {
        return <div>
            Connecting to the server...
        </div>
    }
  return (
    <div className=''>
        <canvas className='border border-red-200' height={1000} width={1200} ref={canvasRef}>
        </canvas>
    </div>
  )
}

export default Canvas