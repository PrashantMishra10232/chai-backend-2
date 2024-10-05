import { Router } from "express";
import {getChannelStats,getChannelVideos } from "../controllers/dashboard.controllers.js"

const router = Router();

router.route("/Stats").get(getChannelStats)
router.route("/getAllVideos/:userId").get(getChannelVideos)

export default router;