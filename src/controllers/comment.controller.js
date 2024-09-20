// import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
// import { generateAccessAndRefereshTokens } from "./user.controller.js";


// generateAccessAndRefereshTokens();

const getVideoComments = asyncHandler(async(req,res)=>{
    const {videoId} =req.params
    const {page = 1, limit = 10} = req.query
    const comments = await Comment.find({videoId:videoId}).populate('User')
    .skip((page -1)*limit)
    .limit(parseInt(limit))
    .exec();
    
    return res
    .status(200)
    .json(new ApiResponse(200,comments))

})

const addComment = asyncHandler(async(req,res)=>{
    console.log(req.body);
    
    const {content} = req.body;

    if(!content){
        throw new ApiError(400,"Add a comment first")
    }

    const comment = await Comment.create({
        content
    })

    if(!comment){
        throw new ApiError(500,"can't save your comment");
        
    }

    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Your comment added successfully"))
})

const updateComment = asyncHandler(async(req,res)=>{
    const {content} = req.body;

    if(!content){
        throw new ApiError(401,"Add a comment first")
    }

    const comment = await Comment.findByIdAndUpdate(
        req.comment?._id,
        {
            $set: {content}
        },
        {new: true}
    )
    
    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Your comment updated successfully"))
    
})

const deleteComment = asyncHandler(async (req, res) => {

    const comment = await Comment.findByIdAndDelete(req.comment?._id)
    
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Your comment deleted successfully"))
})

export{
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}