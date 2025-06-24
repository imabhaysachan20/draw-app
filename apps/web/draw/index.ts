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
            radius:number
        }
export function initDraw(canvas:HTMLCanvasElement) {
        const existingShapes:shape[] = [];
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        const width = canvas.width;
        const height = canvas.height;
        let isMouseDown = false;
        let startX:number, startY:number;
        canvas.addEventListener("mousedown",(e)=>{
            isMouseDown = true;
            const rect = canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
        })
        canvas.addEventListener("mouseup",(e)=>{
            isMouseDown = false;
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
        })
        canvas.addEventListener("mousemove",(e)=>{
            if (isMouseDown) {
                const rect = canvas.getBoundingClientRect();
                const currX = e.clientX - rect.left;
                const currY = e.clientY - rect.top;
                clearCanvas(existingShapes,canvas,ctx)
                ctx.strokeRect(startX,startY,currX-startX,currY-startY);
            }
        })
}

function clearCanvas(existingShapes:shape[],canvas :HTMLCanvasElement,ctx:CanvasRenderingContext2D) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    

    existingShapes.map((shape)=>{
        if (shape.type=="rect")  {
            ctx.strokeRect(shape.startX,shape.startY,shape.width,shape.height)
        }
     })
}