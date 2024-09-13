import { Router } from "express";
import { loginUser, logOutUser, registerUser,refreshAccessToken,changeUserPassword,getCurrentUser,updateAccountDetails,UpdateUserAvatar,UpdateUserCoverImage} from "../controllers/user.controller.js";
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
router.route("/change_password").post(changeUserPassword)    
router.route("/current_user").post(getCurrentUser)    
router.route("/update_Account").post(updateAccountDetails)    
router.route("/update_Avatar").post(UpdateUserAvatar)    
router.route("/update_coverImage").post(UpdateUserCoverImage)    


export default router;