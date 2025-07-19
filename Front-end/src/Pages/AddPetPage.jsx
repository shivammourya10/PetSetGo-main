import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlus, FaImage, FaPaw } from "react-icons/fa";
import Layout from "../components/Layout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import FileUpload from "../components/FileUpload";
import Alert from "../components/Alert";
import PetService from "../services/PetService";
import { useAuth } from "../context/AuthContext";

const AddPetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/user/login', { state: { from: location, message: 'You must be logged in to add a pet' } });
    }
  }, [isAuthenticated, navigate, location]);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "Dog",
    breed: "",
    age: "",
    gender: "Male",
    weight: "",
    availableForBreeding: false,
    description: ""
  });
  
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (file) => {
    console.log("File received in handleFileChange:", file);
    
    // Store the file in a separate state
    setSelectedFile(file);
    
    // We don't need to log inside a setTimeout as setState is asynchronous
    // The current value of selectedFile won't be updated in this function scope
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Authentication check at the component level
      if (!isAuthenticated || !user) {
        throw new Error("User not authenticated");
      }
      
      // Check if file exists before submission
      if (!selectedFile) {
        setError("Please upload a pet image");
        setIsLoading(false);
        return;
      }
      
      console.log("Submitting with file:", selectedFile.name);
      
      // Call the service with appropriate parameters
      await PetService.addPet(formData, selectedFile);
      setSuccess("Pet added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        type: "Dog",
        breed: "",
        age: "",
        gender: "Male",
        weight: "",
        availableForBreeding: false,
        description: ""
      });
      
      // Redirect after short delay
      setTimeout(() => {
        navigate("/pets");
      }, 2000);
      
    } catch (err) {
      // Handle errors
      const errorMsg = err.response?.data?.field 
        ? `${err.response.data.field}: ${err.response.data.msg}`
        : err.response?.data?.message || err.message || "Failed to add pet. Please try again.";
      
      setError(errorMsg);
      console.error("Error adding pet:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto p-4"
      >
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700 flex-grow">
            Add New Pet
          </h1>
        </div>



        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputField
                  label="Pet Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter pet's name"
                  required
                />

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Pet Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Fish">Fish</option>
                    <option value="Reptile">Reptile</option>
                    <option value="Rodent">Rodent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <InputField
                  label="Breed"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="Enter breed"
                  required
                />

                <InputField
                  label="Age (years)"
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  required
                  min="0"
                  step="0.1"
                />

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Gender</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                  </div>
                </div>

                <InputField
                  label="Weight (kg)"
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Enter weight"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Available for Breeding</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="availableForBreeding"
                        value="true"
                        checked={formData.availableForBreeding === true}
                        onChange={(e) => setFormData({...formData, availableForBreeding: e.target.value === "true"})}
                        className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="availableForBreeding"
                        value="false"
                        checked={formData.availableForBreeding === false}
                        onChange={(e) => setFormData({...formData, availableForBreeding: e.target.value === "true"})}
                        className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Pet Photo</label>
                  <FileUpload 
                    onFileSelect={handleFileChange}
                    accept="image/*"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-1">
                      File selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-gray-700 font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your pet's personality, habits, etc."
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/pets")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <FaPaw />
                    </motion.div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add Pet
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default AddPetPage;
