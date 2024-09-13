import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import fs from "fs"


const uploadVideo = asyncHandler(async(req,res)=>{
    const videoLocalPath = req.file?.path

    if(!videoLocalPath){
        throw new ApiError(401,"Video file is required")
    }

    // //verify the uploaded file should be only of video type
    // const fileType = req.files?.mimetype;
    // if(!fileType.startswith("video/")){
    //     throw new ApiError(401,"only video file are allowed")
    // }

    try {
        const video = await uploadOnCloudinary(videoLocalPath)
    
        if(!video){
            throw new ApiError(401, "can't upload file ")
        }
    
        const savedVideo = await Video.create({
            videoFile: video.url
        })


        //clean up local file after uploading
        fs.unlinkSync(videoLocalPath);
    
        return res
        .status(200)
        .json( new ApiResponse(200,savedVideo,"Video uploaded successfully"))
    } catch (error) {
        if (fs.existsSync(videoLocalPath)) {
            fs.unlinkSync(videoLocalPath); // Clean up local file if any error occurs
        }
        return res.status(500).json(new ApiResponse(500, null, "Error uploading video: " + error.message));
        
        
    }
})

export {uploadVideo}