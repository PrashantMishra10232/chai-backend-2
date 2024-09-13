import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})



const deleteOldImages = async(publicId)=>{
    try {
      if(!publicId) return null
      const result = await cloudinary.uploader.destroy(publicId)

      return result;
        
      }
    catch (error) {
        return null;
    }
}

export {deleteOldImages}