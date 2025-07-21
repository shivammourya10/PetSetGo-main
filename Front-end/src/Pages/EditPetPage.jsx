import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEdit, FaImage, FaPaw } from "react-icons/fa";
import Layout from "../components/Layout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import FileUpload from "../components/FileUpload";
import Alert from "../components/Alert";
import PetService from "../services/PetService";
import { useAuth } from "../context/AuthContext";

const EditPetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { petId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPet, setIsLoadingPet] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/user/login', { state: { from: location, message: 'You must be logged in to edit a pet' } });
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
  const [currentImage, setCurrentImage] = useState(null);

  // Fetch existing pet data
  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) return;
      
      try {
        setIsLoadingPet(true);
        const response = await PetService.getPet(petId);
        console.log('Edit Pet - API Response:', response.data);
        
        // Map backend fields to frontend expected names
        const rawPet = response.data?.data || response.data;
        
        setFormData({
          name: rawPet.PetName || rawPet.name || "",
          type: rawPet.PetType || rawPet.type || "Dog",
          breed: rawPet.Breed || rawPet.breed || "",
          age: rawPet.Age || rawPet.age || "",
          gender: rawPet.Gender || rawPet.gender || "Male",
          weight: rawPet.Weight || rawPet.weight || "",
          availableForBreeding: rawPet.AvailableForBreeding || rawPet.availableForBreeding || false,
          description: rawPet.Description || rawPet.description || ""
        });
        
        setCurrentImage(rawPet.PicUrl || rawPet.ImageUrl || rawPet.image);
        
      } catch (err) {
        setError("Failed to load pet details. Please try again.");
        console.error("Error fetching pet:", err);
      } finally {
        setIsLoadingPet(false);
      }
    };

    fetchPet();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (file) => {
    console.log("File received in handleFileChange:", file);
    setSelectedFile(file);
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
      
      console.log("Updating pet with data:", formData);
      console.log("Updating with file:", selectedFile?.name || "No new file");
      
      // Call the service with appropriate parameters
      await PetService.updatePet(petId, formData, selectedFile);
      setSuccess("Pet updated successfully!");
      
      // Redirect after short delay
      setTimeout(() => {
        navigate(`/pets/${petId}`);
      }, 2000);
      
    } catch (err) {
      // Handle errors
      const errorMsg = err.response?.data?.field 
        ? `${err.response.data.field}: ${err.response.data.msg}`
        : err.response?.data?.message || err.message || "Failed to update pet. Please try again.";
      
      setError(errorMsg);
      console.error("Error updating pet:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPet) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-4xl text-purple-600"
          >
            <FaPaw />
          </motion.div>
        </div>
      </Layout>
    );
  }

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
            Edit Pet: {formData.name}
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
                  <label className="block text-gray-700 font-medium">Current Pet Photo</label>
                  {currentImage && (
                    <div className="mb-2">
                      <img 
                        src={currentImage} 
                        alt="Current pet" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <label className="block text-gray-700 font-medium text-sm">Upload New Photo (optional)</label>
                  <FileUpload 
                    onFileSelect={handleFileChange}
                    accept="image/*"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-1">
                      New file selected: {selectedFile.name}
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
                onClick={() => navigate(`/pets/${petId}`)}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <FaEdit className="mr-2" /> Update Pet
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

export default EditPetPage;
