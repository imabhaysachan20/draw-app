import { shape } from "@/types/shape";
import fetch from "./http/fetchExistingShapes";

export class Game {
    private canvas:HTMLCanvasElement
    private existingShape:shape[]
    private roomId:string
    private ctx:CanvasRenderingContext2D
    private isMouseDown:boolean
    private startX:number
    private startY:number
    private socket:WebSocket
    constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket) {
        this.canvas=canvas;
        this.socket = socket
        this.roomId=roomId
        this.existingShape = [];
        this.isMouseDown= false
        this.startX = 0;
        this.startY = 0;
        this.ctx = this.canvas.getContext("2d")!;
        this.init();
        this.initMouseHandlers();
        this.receiveMsg();
    }

    async init() {
        this.existingShape = await fetch(this.roomId);
        this.clearCanvas();
    }
    initMouseHandlers() {

            this.canvas.addEventListener("mousedown",(e)=>{
            this.isMouseDown = true;
            const rect = this.canvas.getBoundingClientRect();
            this.startX = e.clientX - rect.left;
            this.startY = e.clientY - rect.top;
             })

              this.canvas.addEventListener("mousemove",(e)=>{
           
            if (this.isMouseDown) {
                // @ts-ignore
                if (window.currentShape=="rect") {
                const rect = this.canvas.getBoundingClientRect();
                const currX = e.clientX - rect.left;
                const currY = e.clientY - rect.top;
                this.clearCanvas()
                this.ctx.strokeRect(this.startX,this.startY,currX-this.startX,currY-this.startY);
                }
                //@ts-ignore
                if (window.currentShape=="circle") {
                const rect = this.canvas.getBoundingClientRect();
                const currX = e.clientX - rect.left;
                const currY = e.clientY - rect.top;
                const centerX = (this.startX + currX) / 2;
                const centerY = (this.startY + currY) / 2;
                const radiusX = Math.abs(currX - this.startX) / 2;
                const radiusY = Math.abs(currY - this.startY) / 2;
                this.clearCanvas()
                this.ctx.beginPath();
                this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                this.ctx.stroke();
                }
            }

            
        })

         this.canvas.addEventListener("mouseup",(e)=>{
            this.isMouseDown = false;
            if (window.currentShape == "rect") {
            const rect = this.canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;
            const height = endY - this.startY;
            
            const width = endX - this.startX;
            this.existingShape.push({
                type: "rect",
                startX:this.startX,
                startY:this.startY,
                height,
                width
            })
            const message:shape = {type:"rect",startX:this.startX,startY:this.startY,height,width}
            this.socket.send(JSON.stringify({
                type:"chat",
                roomId:this.roomId,
                message:JSON.stringify(message),
                userId:"0bf0d2d9-9f21-44f1-8c56-3e5d9736ede8"
            }))
        }
        else if (window.currentShape = "circle") {
            const rect = this.canvas.getBoundingClientRect();
                const currX = e.clientX - rect.left;
                const currY = e.clientY - rect.top;
                const centerX = (this.startX + currX) / 2;
                const centerY = (this.startY + currY) / 2;
                const radiusX = Math.abs(currX - this.startX) / 2;
                const radiusY = Math.abs(currY - this.startY) / 2;
                this.existingShape.push({
                type: "circle",
                radiusX,
                radiusY,
                centerX,
                centerY
            })
            const message:shape = {type:"circle",centerX, centerY, radiusX, radiusY}
            this.socket.send(JSON.stringify({
                type:"chat",
                roomId:this.roomId,
                message:JSON.stringify(message),
                userId:"0bf0d2d9-9f21-44f1-8c56-3e5d9736ede8"
            }))
        }
        })
    }
    clearCanvas() {
         this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    

    this.existingShape.map((shape)=>{
        if (shape.type=="rect")  {
            this.ctx.strokeRect(shape.startX,shape.startY,shape.width,shape.height)
        }
        else if (shape.type="circle") {
            this.ctx.beginPath();
            this.ctx.ellipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY, 0, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
     })
    }
    receiveMsg() {
         this.socket.onmessage = (e)=>{
            console.log("in")
            const data = JSON.parse(e.data)
            if (data.type=="chat") {
                console.log("in in")
                this.existingShape.push(JSON.parse(data.message))
                this.clearCanvas()
            }
        }
    }
}