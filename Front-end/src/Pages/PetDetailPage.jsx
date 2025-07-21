import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaEdit, FaTrash, FaArrowLeft, FaStethoscope, FaHeartbeat } from "react-icons/fa";
import PetService from "../services/PetService";
import MedicalService from "../services/MedicalService";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Alert from "../components/Alert";

const PetDetailPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isBreedingEnabled, setIsBreedingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState({
    pet: true,
    medical: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setIsLoading(prev => ({ ...prev, pet: true }));
        const response = await PetService.getPet(petId);
        console.log('Pet Detail API Response:', response.data);
        
        // Map backend fields to frontend expected names
        // Backend returns { data: pet } so we access response.data.data
        const rawPet = response.data?.data || response.data;
        const mappedPet = {
          // Use MongoDB _id as the primary ID
          id: rawPet._id,
          _id: rawPet._id,
          // Map actual backend field names to frontend expected names
          name: rawPet.PetName || 'Unknown',
          species: rawPet.PetType || 'Unknown',
          breed: rawPet.Breed || 'Unknown',
          age: rawPet.Age || 'Unknown',
          weight: rawPet.Weight || 'Unknown',
          gender: rawPet.Gender || 'Unknown',
          description: rawPet.Description || rawPet.description || 'No description available.',
          location: rawPet.Location || rawPet.location || 'Unknown location',
          // Enhanced fields
          image: rawPet.PicUrl || rawPet.ImageUrl || rawPet.image || `https://source.unsplash.com/400x400/?${(rawPet.PetType || 'pet').toLowerCase()}`,
          breedingStatus: rawPet.AvailableForBreeding ? 'available' : 'unavailable',
          vaccinated: rawPet.vaccinated || rawPet.Vaccinated || false,
          healthScore: rawPet.healthScore || Math.floor(Math.random() * 20) + 80,
          lastCheckup: rawPet.lastCheckup || new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          createdAt: rawPet.createdAt,
          updatedAt: rawPet.updatedAt,
        };
        
        console.log('Mapped pet data:', mappedPet);
        setPet(mappedPet);
        
        // Set breeding status from pet data
        setIsBreedingEnabled(mappedPet.breedingStatus === 'available');
      } catch (err) {
        setError("Failed to load pet details. Please try again.");
        console.error("Error fetching pet:", err);
        
        // No fallback data - only show real pets from database
        setPet(null);
      } finally {
        setIsLoading(prev => ({ ...prev, pet: false }));
      }
    };
    
    const fetchMedicalRecords = async () => {
      try {
        setIsLoading(prev => ({ ...prev, medical: true }));
        const response = await MedicalService.getMedicalRecords(petId);
        setMedicalRecords(response.data);
      } catch (err) {
        console.error("Error fetching medical records:", err);
        // No fallback data - only show real medical records from database
        setMedicalRecords([]);
      } finally {
        setIsLoading(prev => ({ ...prev, medical: false }));
      }
    };

    if (petId) {
      fetchPet();
      fetchMedicalRecords();
    }
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

  // Handle breeding status toggle
  const handleBreedingStatusToggle = async () => {
    try {
      const newStatus = isBreedingEnabled ? 'unavailable' : 'available';
      await PetService.updateBreedingStatus(petId, newStatus);
      setIsBreedingEnabled(!isBreedingEnabled);
    } catch (err) {
      setError("Failed to update breeding status. Please try again.");
      console.error("Error updating breeding status:", err);
    }
  };

  if (isLoading.pet) {
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

        {/* Medical Records Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaStethoscope className="text-purple-600 mr-2" size={24} />
              <h2 className="text-2xl font-bold text-purple-700">Medical Records</h2>
            </div>
            <Button 
              onClick={() => navigate(`/medical/add?petId=${petId}`)}
              variant="primary"
            >
              Add Record
            </Button>
          </div>

          {isLoading.medical ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
            </div>
          ) : medicalRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prescription
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicalRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {record.description}
                      </td>
                      <td className="px-6 py-4">
                        {record.prescription}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No medical records found. Add your pet's first medical record.
            </div>
          )}
        </div>

        {/* Breeding Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaHeartbeat className="text-pink-600 mr-2" size={24} />
              <h2 className="text-2xl font-bold text-purple-700">Breeding Status</h2>
            </div>
            <div className="flex items-center">
              <span className="mr-3 text-sm">
                {isBreedingEnabled ? 'Available for breeding' : 'Not available for breeding'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  value="" 
                  className="sr-only peer" 
                  checked={isBreedingEnabled}
                  onChange={handleBreedingStatusToggle}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            {isBreedingEnabled ? (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Your pet is currently listed as available for breeding. Other pet owners can send you breeding requests.
                </p>
                <Button 
                  onClick={() => navigate('/breeding/explore')}
                  variant="secondary"
                  className="mt-2"
                >
                  Find Breeding Matches
                </Button>
              </div>
            ) : (
              <p className="text-gray-700">
                Your pet is not available for breeding. Toggle the switch above to make your pet available for breeding requests.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default PetDetailPage;
