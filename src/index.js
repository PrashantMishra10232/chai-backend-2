// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})


connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR:",error);
        throw error
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running at ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo connection is failed",err);
    
})


/*(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR:",error);
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`app is listening on port ${process.env.PORT}`);
            
        })
    } catch (error){
        console.error("ERROR:",error)
        throw error
    }
})()*/
