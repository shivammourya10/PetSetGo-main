import {v2 as cloudinary} from "cloudinary";
import fs from 'fs';
import dotenv from "dotenv";
import path from 'path';

// Use absolute path for better reliability with dotenv
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Log environment status but not sensitive values
console.log(`Cloudinary Configuration Status:
  - Cloud Name: ${process.env.CLOUDINARY_API_NAME ? 'Found ✓' : 'Missing ✗'}
  - API Key: ${process.env.CLOUDINARY_API_KEY ? 'Found ✓' : 'Missing ✗'}
  - API Secret: ${process.env.CLOUDINARY_API_SECRET ? 'Found ✓' : 'Missing ✗'}
`);

// Configure cloudinary with environment variables
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file to Cloudinary with proper error handling
 * @param {string} localFilePath - Path to the local file to upload
 * @returns {Promise<Object|null>} Cloudinary response or null if upload failed
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Check if file exists
        if (!localFilePath) {
            console.error("No file path provided for upload");
            return null;
        }
        
        // Check if file exists at the path
        if (!fs.existsSync(localFilePath)) {
            console.error(`File not found at path: ${localFilePath}`);
            return null;
        }

        // Add a timeout to the upload request
        const uploadPromise = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            quality: "auto",
            fetch_format: "auto",
            timeout: 60000, // 60 seconds timeout
        });
        
        console.log(`Uploading file ${path.basename(localFilePath)} to Cloudinary...`);
        
        // Wait for the upload to complete
        const response = await uploadPromise;
        
        // Log success and cleanup the local file
        console.log(`Upload successful: ${response.public_id}`);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        // Always clean up the local file
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        // Provide detailed error logging
        if (error.http_code === 401) {
            console.error("Cloudinary authentication error: Check your API credentials");
        } else if (error.http_code === 429) {
            console.error("Cloudinary rate limit exceeded: Too many requests");
        } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
            console.error("Network connection error: Cannot connect to Cloudinary API");
        } else {
            console.error("Cloudinary upload error:", error.message);
        }
        
        // Log the complete error for debugging
        console.error(error);
        return null;
    }
};

export default uploadOnCloudinary;