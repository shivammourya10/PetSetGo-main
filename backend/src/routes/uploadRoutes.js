import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import uploadOnCloudinary from '../utils/cloudinary.js';

const router = express.Router();

// General file upload endpoint
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File upload request:', req.file);

    // Upload the file to Cloudinary
    const uploadedFile = await uploadOnCloudinary(req.file.path);
    
    if (!uploadedFile) {
      return res.status(500).json({ message: 'Failed to upload file to Cloudinary' });
    }

    console.log('File uploaded successfully:', uploadedFile);

    return res.status(200).json({
      message: 'File uploaded successfully',
      data: {
        url: uploadedFile.url,
        public_id: uploadedFile.public_id,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ 
      message: 'Server error during file upload', 
      error: error.message 
    });
  }
});

export default router;
