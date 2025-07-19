import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaImage } from 'react-icons/fa';
import Button from './Button';

const FileUpload = ({ onFileSelect, label = 'Upload file', accept = 'image/*', placeholderIcon, placeholderText }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
      
      // Pass the file to the parent component
      if (typeof onFileSelect === 'function') {
        console.log("FileUpload passing file to parent:", file.name);
        onFileSelect(file);
      } else {
        console.error("onFileSelect is not a function");
      }
    }
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
        <div className="space-y-1 text-center">
          {previewUrl ? (
            <motion.img 
              src={previewUrl} 
              alt="Preview" 
              className="mx-auto h-32 w-32 object-cover rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.div
              className="mx-auto h-12 w-12 text-gray-400"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              {placeholderIcon || <FaImage className="h-12 w-12" />}
            </motion.div>
          )}
          
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                ref={fileInputRef}
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileSelect}
                accept={accept}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            {fileName || 'PNG, JPG, GIF up to 10MB'}
          </p>
        </div>
      </div>
      
      <div className="mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current.click()}
          icon={<FaUpload />}
          className="w-full"
        >
          Select File
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
