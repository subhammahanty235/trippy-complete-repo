const express = require('express')

const app = express();

app.use("/" , (req,res)=>{
    res.send("Hello World")
})

app.listen(5050, ()=>{
    console.log("Server listening at port 5050")
})