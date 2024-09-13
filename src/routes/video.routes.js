import { Router } from "express";
import { uploadVideo } from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/upload_video").post(upload.single("videoFile"),uploadVideo)

export default router;