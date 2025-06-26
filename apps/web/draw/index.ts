import { BACKEND_URL } from "@/app/config";
import axios from "axios"
type shape  = {
            type:"rect",
            startX:number,
            startY:number,
            width:number,
            height:number
        }  | {
            type:"circle",
            centerX:number,
            centerY:number,
            radiusX:number,
            radiusY:number
        }
export async function initDraw(canvas:HTMLCanvasElement, roomId:string,socket:WebSocket) {
        const sh = (await fetchExistingShapes(roomId)).messages.map((s:any)=>JSON.parse(s.message))
        const existingShapes:shape[] = sh
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        clearCanvas(existingShapes,canvas,ctx)
        const width = canvas.width;
        const height = canvas.height;
        let isMouseDown = false;
        let startX:number, startY:number;
        socket.onmessage = (e)=>{
            console.log("in")
            
            const data = JSON.parse(e.data)
            if (data.type=="chat") {
                console.log("in in")
                existingShapes.push(JSON.parse(data.message))
                clearCanvas(existingShapes,canvas,ctx)
            }
        }
        canvas.addEventListener("mousedown",(e)=>{
            isMouseDown = true;
            const rect = canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
        })
        canvas.addEventListener("mousemove",(e)=>{
            // @ts-ignore
            console.log(window.currentShape)
            if (isMouseDown) {
                // @ts-ignore
                if (window.currentShape=="rect") {
                const rect = canvas.getBoundingClientRect();
                const currX = e.clientX - rect.left;
                const currY = e.clientY - rect.top;
                clearCanvas(existingShapes,canvas,ctx)
                ctx.strokeRect(startX,startY,currX-startX,currY-startY);
                }
                //@ts-ignore
                if (window.currentShape=="circle") {
                const rect = canvas.getBoundingClientRect();
                const currX = e.clientX - rect.left;
                const currY = e.clientY - rect.top;
                const centerX = (startX + currX) / 2;
                const centerY = (startY + currY) / 2;
                const radiusX = Math.abs(currX - startX) / 2;
                const radiusY = Math.abs(currY - startY) / 2;
                clearCanvas(existingShapes,canvas,ctx)
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                ctx.stroke();
                }
            }
        })
        canvas.addEventListener("mouseup",(e)=>{
            isMouseDown = false;
            if (window.currentShape == "rect") {
            const rect = canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;
            const height = endY - startY;
            const width = endX - startX;
            existingShapes.push({
                type: "rect",
                startX,
                startY,
                height,
                width
            })
            const message:shape = {type:"rect",startX,startY,height,width}
            socket.send(JSON.stringify({
                type:"chat",
                roomId,
                message:JSON.stringify(message),
                userId:"0bf0d2d9-9f21-44f1-8c56-3e5d9736ede8"
            }))
        }
        else if (window.currentShape = "circle") {
            const rect = canvas.getBoundingClientRect();
                const currX = e.clientX - rect.left;
                const currY = e.clientY - rect.top;
                const centerX = (startX + currX) / 2;
                const centerY = (startY + currY) / 2;
                const radiusX = Math.abs(currX - startX) / 2;
                const radiusY = Math.abs(currY - startY) / 2;
                existingShapes.push({
                type: "circle",
                radiusX,
                radiusY,
                centerX,
                centerY
            })
            const message:shape = {type:"circle",centerX, centerY, radiusX, radiusY}
            socket.send(JSON.stringify({
                type:"chat",
                roomId,
                message:JSON.stringify(message),
                userId:"0bf0d2d9-9f21-44f1-8c56-3e5d9736ede8"
            }))
        }
        })
      
}

async function fetchExistingShapes(roomId:string) {
    try {
    const resp = await axios.get(`${BACKEND_URL}/chat/${roomId}`) ;
    return resp.data;
    }
    catch(e) {
        console.log(e)
    }
}

function clearCanvas(existingShapes:shape[],canvas :HTMLCanvasElement,ctx:CanvasRenderingContext2D) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    

    existingShapes.map((shape)=>{
        if (shape.type=="rect")  {
            ctx.strokeRect(shape.startX,shape.startY,shape.width,shape.height)
        }
        else if (shape.type="circle") {
            ctx.beginPath();
            ctx.ellipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
     })
}