import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Tweet} from "../models/tweet.models.js"


const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;

    if(!content){
        throw new ApiError(401,"Tweet is required")
    }

    const tweets = await Tweet.create({
        content: content
    })

    if(!tweets){
        throw new ApiError(401,"can't create your tweet")
    }

    return res.status(200)
    .json(new ApiResponse(200,tweets,"This is your tweet"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user?._id;

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner : mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project: {
                content: 1,
                owner: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200,{tweets},"here are all your tweets"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body;

    if(!content){
        throw new ApiError(401,"Tweet is required")
    }

    if(!(req.tweet.owner.toString() == req.user?._id)){
        throw new ApiError(403, "you are the authorized personal to update this tweet")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        req.tweet?._id,
        {
            $set:{
                content
            }
        },
        {new : true}
    )

    if(!updatedTweet){
        throw new ApiError(401,"can't update your tweet")
    }

    return res.status(200)
    .json(new ApiResponse(200,updatedTweet,"This is your updated tweet"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    if(!(req.tweet?.owner.toString()==req.user?._id)){
        throw new ApiError(403,"you are not the authorized personal to delete this tweet")
    }

    const deleteTweet = await Tweet.findByIdAndDelete(
        req.tweet?._id
    )

    if(!deleteTweet){
        throw new ApiError(401,"can't delete your tweet")
    }

    return res.status(200)
    .json(new ApiResponse(200,null," your tweet is deleted"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}