import {v2 as cloudinary} from "cloudinary";
import fs from 'fs';  // Add the fs import
import dotenv from "dotenv"

dotenv.config({
    path: "../.env"  // Add the path to your .env file
});
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
//console.log(process.env.CLOUDINARY_API_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET); // Debugging line to check if the environment variables are loaded correctly

const uploadOnCloudinary = async(localFilePath)=>{
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            quality: "auto",
            fetch_format: "auto", // Fixed: was "fetc_format"
        })
        fs.unlinkSync(localFilePath);
        return response;
    }catch(e){
        fs.unlinkSync(localFilePath);
        console.log(e);
        return null;
    }
}

export default uploadOnCloudinary;