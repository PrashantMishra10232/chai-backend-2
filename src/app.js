import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16mb"}))
app.use(express.urlencoded({extended: true, limit: "16mb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from "./routes/user.routes.js"  //yha userRouter humne manchaha naam sirf tbhi de skte h jb export default kr re ho jese ki routes folder m kiya h
import videoRouter from "./routes/video.routes.js"

// routes declaration
app.use("/api/v1/user",userRouter)
app.use("/api/v1/video",videoRouter)

export {app};