import { Router } from "express";
import { loginUser, 
         logOutUser, 
         registerUser,
         refreshAccessToken,
         changeUserPassword,
         getCurrentUser,
         updateAccountDetails,
         UpdateUserAvatar,
         UpdateUserCoverImage, 
         getUserChannelProfile, 
         getWatchHistory
        } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh_token").post(refreshAccessToken)
router.route("/change_password").post(verifyJWT ,changeUserPassword)    
router.route("/current_user").get(verifyJWT,getCurrentUser)    
router.route("/update_Account").patch(verifyJWT,updateAccountDetails)    
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),UpdateUserAvatar)    
router.route("/coverImage").patch(verifyJWT,upload.single("coverImage"),UpdateUserCoverImage)    
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)    
router.route("/history").get(verifyJWT,getWatchHistory)    


export default router;