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
import commentRouter from "./routes/comment.routes.js"
import likesRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import playlistRouter from "./routes/playlist.routes.js"

// routes declaration
app.use("/api/v1/user",userRouter)
app.use("/api/v1/video",videoRouter)
app.use("/api/v1/comment",commentRouter)
app.use("/api/v1/likes",likesRouter)
app.use("api/v1/tweet",tweetRouter)
app.use("api/v2/playlist",playlistRouter)

export {app};