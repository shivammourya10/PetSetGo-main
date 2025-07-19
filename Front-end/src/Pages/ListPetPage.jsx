import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Alert from "../components/Alert";
import AdoptionService from "../services/AdoptionService";
import { useAuth } from "../context/AuthContext";

const ListPetPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    type: "Adoption", // Default to "Adoption", can also be "Rescue"
    name: "",
    age: "",
    species: "dog",
    breed: "",
    gender: "male",
    location: "",
    description: ""
  });
  
  // File state
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview URL for the image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please upload an image of the pet");
      return;
    }
    
    if (formData.description.length < 5) {
      setError("Please provide a detailed description (at least 5 characters)");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await AdoptionService.listPetForAdoption(formData, file);
      
      setSuccess("Pet successfully listed for adoption!");
      setTimeout(() => {
        navigate('/adoption');
      }, 2000);
    } catch (err) {
      console.error("Error listing pet for adoption:", err);
      setError(err.response?.data?.message || "Failed to list pet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-4 max-w-2xl"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-purple-700 mb-6"
        >
          List Your Pet for {formData.type}
        </motion.h1>
        
        {error && (
          <motion.div variants={itemVariants}>
            <Alert type="error" message={error} />
          </motion.div>
        )}
        
        {success && (
          <motion.div variants={itemVariants}>
            <Alert type="success" message={success} />
          </motion.div>
        )}
        
        <motion.form 
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Listing Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="Adoption"
                  checked={formData.type === "Adoption"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Adoption
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="Rescue"
                  checked={formData.type === "Rescue"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Rescue
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <InputField
              label="Pet Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <InputField
                label="Age (years)"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Species
              </label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <InputField
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="City, State"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              minLength={5}
              required
              placeholder="Tell us about your pet's personality, habits, and why they need a new home or rescue"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Pet Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required
            />
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Pet Preview"
                  className="w-full max-h-48 object-cover rounded"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/adoption')}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "List Pet"}
            </Button>
          </div>
        </motion.form>
      </motion.div>
    </Layout>
  );
};

export default ListPetPage;
