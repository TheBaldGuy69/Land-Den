const express=require("express");
let app=express();
const port=8000;


app.get("/home",(req,res)=>{
res.send("successfully runing");
});



app.listen(port,()=>{
console.log(`server is serving successfullly at ${port}`)
});