import { Like } from "../models/like.models.js";
import mongoose, {isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user?._id

    //check if user has already liked the video
    const existedLike = await Like.findOne({video: videoId, user:userId});

    if(existedLike){
        await Like.findByIdAndDelete(existedLike._id);
        return res.status(200)
        .json(new ApiResponse(200,null,"like removed"))
    }else{
        const newLike = await Like.create({
            video: videoId,
            user: userId
        })
        return res.status(200).json(new ApiResponse(200, newLike, "Like added"));
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    // const comment = await Comment.findById(commentId) //ese store krne ki need nhi h direct validObjectId se ho jaega kaam chill

    if(!isValidObjectId(commentId)){
        throw new ApiError(401,"Comment not found")
    }
    //TODO: toggle like on comment
    const userId = req.user?._id

    //check if the user has already liked the comment
    const existedLike = await Like.findOne({
        comment: commentId,
        user: userId
    })

    if(existedLike){
        await Like.findByIdAndDelete(existedLike._id)
        return res.status(200)
        .json(new ApiResponse(200,null,"like removed"))
    }else{
        const likeComment = await Like.create(
            {
                comment: commentId,
                user: userId
            }
        )
        return res
        .status(200)
        .json(new ApiResponse(200,likeComment,"like added"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(404, "Tweet not found")
    }
    //TODO: toggle like on tweet
    const userId = req.user?._id

    //check if user already liked the tweet
    const existingLike = await Like.findOne({
        tweet: tweetId,
        user: userId
    })

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200)
        .json(new ApiResponse(200,null,"like removed"))
    }else{
        const tweetLike = await Like.create({
            tweet: tweetId,
            user: userId
        })
        return res.status(200)
        .json(new ApiResponse(200,tweetLike,"Tweet Liked"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id

    if (!userId) {
        return res.status(400).json(new ApiError(400, "User not authenticated"));
    }

    const allLikedVideos = await Like.aggregate([
        {
            $match: {
                user: mongoose.Types.objectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideos"
            }
        },
        {
            $unwind: {
                path: "$likedVideos",
                preserveNullAndEmptyArrays: true //optional, if user has no likes
            }
        },
        {
            $project: {
                _id: "$likedVideos._id",
                videoFile: "$likedVideos.videoFile",
                thumbnail:"$likedVideos.thumbnail",
                title: "$likedVideos.title",
                description:"$likedVideos.description",
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200,allLikedVideos,"Here is your all liked videos"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}