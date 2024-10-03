import mongoose , {isValidObjectId} from "mongoose";
import {Playlist} from "..//models/playlist.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!(name && description)){
        throw new ApiError(400,"Please add name and description to your playlist")
    }
    const userId = req.user?._id
    const playlist = await Playlist.create(
        {
            name,
            description,
            owner: userId
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"Your playlist is created"))
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!userId) {
        throw new ApiError(400, "User not authenticated");
    }

    const playlist = await Playlist.find(userId);
    return res.status(200)
    .json(new ApiResponse(200,playlist,"Here is the playlist"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist Id")
    }

    const playlist = await Playlist.findById(playlistId).populate("videos")

    
    if(!playlist){
        throw new ApiError(400,"Invalid playlist Id")
    }

    return res.status(200)
    .json(new ApiResponse(200,playlist,"Here is the playlist"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlist ID and video ID")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "PlayList not found")
    }

    if(!(playlist.owner.toString() == req.user?._id.toString())){
        throw new ApiError(400,"You are the the authorized personal to perform this action")
    }

    //check if the video is already present in the playlist
    if(playlist.videos.includes(videoId)){
        throw new ApiError(400,"Video is already in the playlist")
    }

    //if not then push the video into the playlist video array
    playlist.videos.push(videoId)
    await playlist.save();
     

    return res.status(200)
    .json(new ApiResponse(200,playlist,"Video added to the playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlist ID and video ID")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "PlayList not found")
    }

    //check if the user that is tryng to delete the playlist is also the owner of the playlist
    if(!(playlist.owner.toString() == req.user?._id.toString())){
        throw new ApiError(400,"You are the the authorized personal to perform this action")
    }

    //find if video is even present in the playlist
    if(!playlist.videos.includes(videoId)){
        throw new ApiError(400,"Video is not in the playlist")
    }

    //firts find the index of the video in the playlist
    const index = playlist.videos.indexOf(videoId)
    if(index !== -1){
        playlist.videos.splice(index,1);
    }
    await playlist.save()

    return res.status(200)
    .json(new ApiResponse(200,playlist,"Video removed from the playlist"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const playlist = await Playlist.findById(playlistId)
    if(playlist){
        throw new ApiError(404,"Playlist not found")
    }

    if(!(playlist.owner.toString() == req.user?._id.toString())){
        throw new ApiError(400,"You are the the authorized personal to perform this action")
    }
    const deletePlaylist = await Playlist.findByIdAndDelete(
        playlistId
    )

    if(!deletePlaylist){
        throw new ApiError(400,"Unable to delete the playlist")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200,null,"Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!(name && description)){
        throw new ApiError(400,"Please add name and description to your playlist")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if(!(playlist.owner.toString() == req.user?._id.toString())){
        throw new ApiError(400,"You are the the authorized personal to perform this action")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {
            new: true
        }
    ).select('-owner')

    return res
    .status(200)
    .json(new ApiResponse(200,updatedPlaylist,"Playlist updated successfully"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}