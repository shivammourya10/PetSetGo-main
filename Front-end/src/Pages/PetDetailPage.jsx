import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import PetService from "../services/PetService";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Alert from "../components/Alert";

const PetDetailPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setIsLoading(true);
        const response = await PetService.getPet(petId);
        setPet(response.data);
      } catch (err) {
        setError("Failed to load pet details. Please try again.");
        console.error("Error fetching pet:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await PetService.deletePet(petId);
        navigate("/pets");
      } catch (err) {
        setError("Failed to delete pet. Please try again.");
        console.error("Error deleting pet:", err);
      }
    }
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

  if (error) {
    return (
      <Layout>
        <Alert type="error" message={error} />
        <Button onClick={() => navigate("/pets")} className="mt-4">
          Back to Pets
        </Button>
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
          <Button 
            onClick={() => navigate("/pets")}
            variant="secondary"
            className="mr-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-purple-700 flex-grow">
            {pet?.name}
          </h1>
          <div className="space-x-2">
            <Button 
              onClick={() => navigate(`/pets/edit/${petId}`)}
              variant="secondary"
            >
              <FaEdit className="mr-2" /> Edit
            </Button>
            <Button 
              onClick={handleDelete}
              variant="danger"
            >
              <FaTrash className="mr-2" /> Delete
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="aspect-square rounded-lg overflow-hidden"
            >
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
            </motion.div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-600">Breed</h2>
                <p className="text-xl">{pet?.breed || "Unknown"}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-600">Age</h2>
                <p className="text-xl">{pet?.age || "Unknown"} years</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-600">Gender</h2>
                <p className="text-xl">{pet?.gender || "Unknown"}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-600">Weight</h2>
                <p className="text-xl">{pet?.weight || "Unknown"} kg</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-600">About</h2>
            <p className="text-lg mt-2">{pet?.description || "No description available."}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg shadow p-6"
            onClick={() => navigate(`/medical-records/${petId}`)}
          >
            <h2 className="text-xl font-bold text-purple-700 mb-2">Medical Records</h2>
            <p className="text-gray-600">View and manage medical history</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg shadow p-6"
            onClick={() => navigate(`/breeding/${petId}`)}
          >
            <h2 className="text-xl font-bold text-purple-700 mb-2">Breeding Profile</h2>
            <p className="text-gray-600">View breeding information and potential matches</p>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default PetDetailPage;
