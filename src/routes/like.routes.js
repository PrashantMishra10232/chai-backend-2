
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleCommentLike,toggleTweetLike,toggleVideoLike,getLikedVideos } from "../controllers/like.controller.js";

const router = Router();

router.route("/toggleCommentLike").patch(verifyJWT,toggleCommentLike)
router.route("/toggleTweetLike").patch(verifyJWT,toggleTweetLike)
router.route("/toggleVideoLike").patch(verifyJWT,toggleVideoLike)
router.route("/getLikedVideos").get(verifyJWT,getLikedVideos)

export default router;