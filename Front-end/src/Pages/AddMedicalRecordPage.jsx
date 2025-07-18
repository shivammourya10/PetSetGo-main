import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlus, FaArrowLeft, FaPaw } from "react-icons/fa";
import Layout from "../components/Layout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Alert from "../components/Alert";
import FileUpload from "../components/FileUpload";
import MedicalService from "../services/MedicalService";

const AddMedicalRecordPage = () => {
  const navigate = useNavigate();
  const { petId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    recordType: "checkup",
    date: new Date().toISOString().split('T')[0],
    veterinarianName: "",
    clinic: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    notes: "",
    followUp: "",
    documents: null
  });

  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) return;
      
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await PetService.getPet(petId);
        
        // For now, using dummy data
        setPet({
          _id: petId,
          name: "Buddy",
          species: "dog",
          breed: "Golden Retriever"
        });
      } catch (err) {
        setError("Failed to load pet details.");
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
  };

  const handleFileChange = (file) => {
    setFormData({
      ...formData,
      documents: file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const recordData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          recordData.append(key, formData[key]);
        }
      });
      
      if (petId) {
        recordData.append("petId", petId);
      }
      
      await MedicalService.addMedicalRecord(recordData);
      setSuccess("Medical record added successfully!");
      
      // Reset form or redirect
      setTimeout(() => {
        if (petId) {
          navigate(`/medical/${petId}`);
        } else {
          navigate("/medical");
        }
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add medical record. Please try again.");
      console.error("Error adding medical record:", err);
    } finally {
      setIsLoading(false);
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
            onClick={() => navigate(petId ? `/medical/${petId}` : "/medical")}
            variant="secondary"
            className="mr-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-purple-700 flex-grow">
            Add Medical Record {pet ? `for ${pet.name}` : ""}
          </h1>
        </motion.div>

        {error && <motion.div variants={itemVariants}><Alert type="error" message={error} /></motion.div>}
        {success && <motion.div variants={itemVariants}><Alert type="success" message={success} /></motion.div>}

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {!petId && (
                  <div className="space-y-2">
                    <label htmlFor="petSelect" className="block text-gray-700 font-medium">
                      Select Pet
                    </label>
                    <select
                      id="petSelect"
                      name="petId"
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select a pet</option>
                      {/* This would be populated from API in a real app */}
                      <option value="1">Buddy (Golden Retriever)</option>
                      <option value="2">Luna (Siamese Cat)</option>
                      <option value="3">Max (German Shepherd)</option>
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="recordType" className="block text-gray-700 font-medium">
                    Record Type
                  </label>
                  <select
                    id="recordType"
                    name="recordType"
                    value={formData.recordType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="checkup">Regular Checkup</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="injury">Injury/Wound</option>
                    <option value="surgery">Surgery</option>
                    <option value="dental">Dental Care</option>
                    <option value="parasites">Parasite Treatment</option>
                    <option value="allergy">Allergy/Skin Issue</option>
                    <option value="chronic">Chronic Condition</option>
                    <option value="emergency">Emergency Visit</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <InputField
                  label="Date"
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Veterinarian Name"
                  id="veterinarianName"
                  name="veterinarianName"
                  value={formData.veterinarianName}
                  onChange={handleChange}
                  placeholder="Dr. Smith"
                  required
                />

                <InputField
                  label="Clinic/Hospital"
                  id="clinic"
                  name="clinic"
                  value={formData.clinic}
                  onChange={handleChange}
                  placeholder="Happy Paws Veterinary Clinic"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="diagnosis" className="block text-gray-700 font-medium">
                    Diagnosis
                  </label>
                  <textarea
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter diagnosis details"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="treatment" className="block text-gray-700 font-medium">
                    Treatment
                  </label>
                  <textarea
                    id="treatment"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter treatment details"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="medications" className="block text-gray-700 font-medium">
                    Medications
                  </label>
                  <textarea
                    id="medications"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="List prescribed medications and dosages"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="followUp" className="block text-gray-700 font-medium">
                  Follow-up Instructions
                </label>
                <textarea
                  id="followUp"
                  name="followUp"
                  value={formData.followUp}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter any follow-up care instructions"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="block text-gray-700 font-medium">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter any additional notes or observations"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  Documents (Optional)
                </label>
                <FileUpload 
                  onFileChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  placeholderText="Upload related documents or images (X-rays, lab results, etc.)"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(petId ? `/medical/${petId}` : "/medical")}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add Record
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

export default AddMedicalRecordPage;
