import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query="", sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const queryCondition = query
    ? { $or: [
         { title: { $regex: query.toString(), $options: 'i' } },
         { description: { $regex: query.toString(), $options: 'i' } }
       ]}
    : {};

    const videos = await Video.aggregate([
        {
            $match: {
                $and: [
                   queryCondition,
                    ...(userId? [{owner: new mongoose.Types.ObjectId(userId)}]:[])
                ]
                
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "createdBy"
            }
        },
        {
            $unwind : "$createdBy"
        },
        {
            $sort: {
                [sortBy]: sortType === 'asc'? 1:-1
            }
        },
        {
            $skip: (page-1)*limit
        },
        {
            $limit: parseInt(limit)
        },
        {
            $project: {
                _id: 1,
                thumbnail: 1,
                title:1,
                description:1,
                'createdBy.fullName': 1,
                createdAt: 1
            }
        },
    ]);

    console.log('query:', query);

    // const video = await Video.find({})
    console.log(videos)

    if ( videos?.length === 0 ) { return res.status( 404 ).json( new ApiResponse( 404, {}, "No Videos Found" ) ); }

    return res
    .status(200)
    .json(new ApiResponse(200,{videos},"here are all your videos related to your query"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(
        [title, description].some((field)=>
        field?.trim() == "")
    ){
        throw new ApiError(400,"Title and Description both are required")
    }

    const videoLocalPath = await req.files?.videoFile[0].path;
    console.log(videoLocalPath);
    
    const thumbnailLocalPath = await req.files?.thumbnail[0].path;
    console.log(thumbnailLocalPath);
    
    

    if(!videoLocalPath){
        throw new ApiError(400,"Video file is required")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"Thumbnail file is required")
    }

    const uploadVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!uploadVideo){
        throw new ApiError(401,"Error while uploading the video file")
    }
    if(!uploadThumbnail){
        throw new ApiError(401,"Error while uploading the thumbnail")
    }



    const video = await Video.create({
        videoFile: uploadVideo.url,
        thumbnail: uploadThumbnail.url,
        title,
        description,
        duration: videoLocalPath.duration,
        owner: req.user?._id,
    })


    if(!video){
        throw new ApiError(500,"Something went wrong on our side")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,"Your video and Thumbnail uploaded successfully"))
})


const getVideoById = asyncHandler(async(req,res)=>{
    const { videoId } = req.params
    console.log(videoId);
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    //TODO: get video by id
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"Video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video,"your requested video is here"))
})

const updateVideo = asyncHandler(async(req,res)=>{
    const { videoId } = req.params
    const { title, description} = req.body

    if(!(title || description || req.file)){
        throw new ApiError(400,"All fields are required")
    }

    const UpdatedFields = {};

    if(title)UpdatedFields.title = title
    if(description)UpdatedFields.description = description

    if(req.file){
        const thumbnailLocalPath = req.file.path;

        if(!thumbnailLocalPath){
            throw new ApiError(400,"Thumbnail file is required")
        }

        const thumbnailResult = await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnailResult){
           throw new ApiError(500,"Error while uploading your thumbnail")
        }

        UpdatedFields.thumbnail = thumbnailResult.url
    }

    console.log(UpdatedFields);

    //TODO: update video details like title, description, thumbnail
    const updatedVideoDetails = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: UpdatedFields
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200,updatedVideoDetails,"Video details updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video = await Video.findById(videoId);

    //delete video from cloudinary
    const publicId = video.videoFile.split('/').pop().split('.')[0]; //extract publicId
    console.log(publicId);
    
    await deleteFromCloudinary(publicId)//delete video from cloudinary


    if(video.thumbnail){
        //delete the thumbnail from cloudinary
     const publicIdThumbnail = video.thumbnail.split('/').pop().split('.')[0];
     await deleteFromCloudinary(publicIdThumbnail);
    }

    //delete video document from database
     await Video.findByIdAndDelete(videoId)

    return res
    .status(200)
    .json(new ApiResponse(200,null,"Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)

    if(!(video?.owner.toString() == req.user?._id.toString())){
        throw new ApiError(401,"You are not allowed to update this settings")
    }

    const videoChanged = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        {new : true}
    )
       
    return res.json(new ApiResponse(200,videoChanged,"changed view of publication"))
})


export {publishAVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus,getAllVideos}