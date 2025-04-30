import express from 'express'
const app = express();

app.get("/",async (req,res)=>{
    res.json("hello")
})

app.listen(3000,()=>{
    console.log("hey")
})