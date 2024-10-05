import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?._id;
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user ID")
    }
    const videosCount = await Video.aggregate([
        {
            $match: {
                owner: mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {$sum: "$views"},
                totalVideos: {$sum: 1}
            }
        },
        {
            $project: {
                _id: 0,
                totalViews: 1,
                totalVideos: 1
            }
        }
    ])

    const totalSubs = await Subscription.aggregate([
        {
            $match: {
                channel: mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalSubscribers: {$sum: 1}
            }
        },
        {
            $project: {
                _id: 0,
                totalSubscribers: 1
            }
        }
    ])

    const likedVideos = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoInfo"
            }
        },
        {
            $match: {
                "videoInfo.owner": mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: {$sum: 1}
            }
        },
        {
            $project: {
                _id: 0,
                totalLikes: 1
            }
        }
    ])

    const info = {
        views: videosCount.length > 0 ? videosCount[0].totalViews: 0,
        videos: videosCount.length > 0 ? videosCount[0].totalVideos: 0,
        totalSubs: totalSubs.length > 0 ? totalSubs[0].totalSubscribers: 0,
        totalLikes: likedVideos.length > 0 ? likedVideos[0].totalLikes: 0,
    }

    return res
    .status(200)
    .json(new ApiResponse(200,info,"Your video stats"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(400,"User ID not found")
    }
    // const allVideos = await Video.find({owner: userId})
    // return res
    // .status(200)
    // .json(new ApiResponse(200,allVideos,"Here is all your videos"))

    const allVideo = await Video.aggregate([
        {
            $match: {
                owner: mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project: {
                _id: 0,
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                owner: 1,
                cretedAt: 1,
                updatedAt: 1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200,allVideo,"Here is all your videos"))
})

export {
    getChannelStats, 
    getChannelVideos
    }