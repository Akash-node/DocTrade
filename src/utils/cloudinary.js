import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: Process.env.CLOUDINARY_NAME,
    api_key: Process.env.CLOUDINARY_API_KEY, 
    api_secret: Process.env.CLOUDINARY_API_SECERT // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudnary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        //upload the file on cloudinary
        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //file has been uploaded successfully
        console.log("file is uploaded succesfully", response.url);
        return response;
        
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved tempopary file
        return null; 
    }
}

export {uploadOnCloudnary}