import { Router } from "express";
import { getVideoComments, addComment, updateComment,deleteComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/comments").get(getVideoComments)
router.route("/addComment").post(verifyJWT,addComment)
router.route("/updateComment").post(verifyJWT,updateComment)
router.route("/deleteComment").post(verifyJWT,deleteComment)



export default router;

























