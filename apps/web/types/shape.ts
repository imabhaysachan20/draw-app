export type shape  = {
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