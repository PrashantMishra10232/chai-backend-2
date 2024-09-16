import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        comment: {
            types: Schema.Types.ObjectId,
            ref: "Comment"
        },
        video: {
            types: Schema.Types.ObjectId,
            ref: "Video"
        },
        likedBy: {
            types: Schema.Types.ObjectId,
            ref: "User"
        },
        tweet: {
            types: Schema.Types.ObjectId,
            ref: "Tweet"
        }
    },
    {
        timestamps: true
    }
)

export const like = mongoose.model("like",likeSchema)