import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import Layout from "../components/Layout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Alert from "../components/Alert";

const AdoptionRequestPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    hasOtherPets: "no",
    otherPetsDetails: "",
    housingType: "house",
    hasYard: "no",
    workSchedule: "",
    familySize: "",
    experience: "",
    reason: ""
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await AdoptionService.getPet(petId);
        
        // For now, using dummy data
        setPet({
          _id: petId,
          name: "Buddy",
          species: "dog",
          breed: "Golden Retriever",
          age: 2,
          gender: "male",
          image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        });
      } catch (err) {
        setError("Failed to load pet details. Please try again.");
        console.error("Error fetching pet:", err);
      } finally {
        setIsLoading(false);
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
    
    // Clear conditional fields if not needed
    if (name === "hasOtherPets" && value === "no") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        otherPetsDetails: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // await AdoptionService.submitApplication(petId, formData);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess("Your adoption request has been submitted successfully! Our team will review your application and contact you soon.");
      
      // Reset form after success message
      setTimeout(() => {
        navigate("/adoption");
      }, 3000);
      
    } catch (err) {
      setError("Failed to submit adoption request. Please try again.");
      console.error("Error submitting adoption request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (isLoading) {
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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-4"
      >
        <motion.div variants={itemVariants} className="flex items-center mb-6">
          <Button 
            onClick={() => navigate("/adoption")}
            variant="secondary"
            className="mr-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-purple-700 flex-grow">
            Adopt {pet?.name}
          </h1>
        </motion.div>

        {error && <motion.div variants={itemVariants}><Alert type="error" message={error} /></motion.div>}
        {success && <motion.div variants={itemVariants}><Alert type="success" message={success} /></motion.div>}

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-6">
              <div className="aspect-square overflow-hidden">
                {pet?.image ? (
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FaPaw className="text-6xl text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-2xl font-bold text-purple-700">{pet?.name}</h2>
                <p className="text-gray-600 mb-2">{pet?.breed}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-semibold">{pet?.age} {pet?.age === 1 ? "year" : "years"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold capitalize">{pet?.gender}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-purple-700 mb-6">Adoption Application</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="First Name"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      label="Last Name"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      label="Email"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      label="Phone"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Address</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Street Address"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputField
                        label="City"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                      <InputField
                        label="State/Province"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                      <InputField
                        label="ZIP/Postal Code"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Living Situation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Housing Type</label>
                      <select
                        name="housingType"
                        value={formData.housingType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="condo">Condominium</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Do you have a yard?</label>
                      <div className="flex space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="hasYard"
                            value="yes"
                            checked={formData.hasYard === "yes"}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="hasYard"
                            value="no"
                            checked={formData.hasYard === "no"}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Do you have other pets?</label>
                      <div className="flex space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="hasOtherPets"
                            value="yes"
                            checked={formData.hasOtherPets === "yes"}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="hasOtherPets"
                            value="no"
                            checked={formData.hasOtherPets === "no"}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Family Size</label>
                      <InputField
                        id="familySize"
                        name="familySize"
                        placeholder="Number of adults and children"
                        value={formData.familySize}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  {formData.hasOtherPets === "yes" && (
                    <div className="mt-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Please provide details about your other pets
                      </label>
                      <textarea
                        name="otherPetsDetails"
                        value={formData.otherPetsDetails}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Species, breed, age, temperament, etc."
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Work Schedule
                      </label>
                      <textarea
                        name="workSchedule"
                        value={formData.workSchedule}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Describe your typical work hours and time available for pet care"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Pet Care Experience
                      </label>
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Describe your previous experience with pets"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Why do you want to adopt {pet?.name}?
                      </label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Tell us why you'd like to adopt this pet and what kind of home you can provide"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <FaPaw />
                        </motion.div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" /> Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AdoptionRequestPage;
