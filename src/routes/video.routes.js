import { Router } from "express";
import { getAllVideos,publishAVideo,getVideoById,updateVideo,deleteVideo } from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/getAllVideo").get(getAllVideos)
router.route("/publishVideo").post(verifyJWT,upload.fields(
    [
        {
           name:  "videoFile", 
           maxCount: 1
        },
        {
           name:  "thumbnail", 
           maxCount: 1
        },
    ]
),publishAVideo)
router.route("/getVideo/:videoId").get(getVideoById)

router.route("/update_fields/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideo)
router.route("/delete_video/:videoId").delete(verifyJWT,deleteVideo)

export default router;