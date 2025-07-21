import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaPaw, FaFileMedical, FaCalendarAlt } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import MedicalService from '../services/MedicalService';
import PetService from '../services/PetService';
import { useAuth } from '../context/AuthContext.jsx';

const MedicalRecordsPage = () => {
  const [pets, setPets] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // In a real app, we would fetch the user's pets
        // const petsResponse = await PetService.getUserPets();
        // const pets = petsResponse.data;
        
        // No dummy data - only show real pets from database
        setPets([]);
        
        // No selected pet if no pets available
        setSelectedPet(null);
        setRecords([]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handlePetChange = async (pet) => {
    setSelectedPet(pet);
    setLoading(true);
    
    try {
      // In a real app:
      // const response = await MedicalService.getMedicalRecords(pet.id);
      // setRecords(response.data);
      
      // Use dummy data for now
      setTimeout(() => {
        const dummyRecords = [
          {
            id: pet.id * 100 + 1,
            petId: pet.id,
            date: '2025-07-01T10:30:00Z',
            title: `${pet.name}'s Annual Checkup`,
            description: 'Regular annual checkup. All vitals normal.',
            prescription: 'Continue current preventative medications.',
            vet: 'Dr. Smith',
            clinic: 'Happy Paws Veterinary'
          },
          {
            id: pet.id * 100 + 2,
            petId: pet.id,
            date: '2025-06-15T14:20:00Z',
            title: 'Vaccination',
            description: 'Core vaccines administered.',
            prescription: 'No medications prescribed.',
            vet: 'Dr. Johnson',
            clinic: 'Happy Paws Veterinary'
          },
        ];
        
        setRecords(dummyRecords);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records. Please try again later.');
      setLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Layout title="Medical Records">
      {pets.length === 0 && !loading ? (
        <div className="text-center py-12">
          <FaPaw className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Pets Found</h3>
          <p className="text-gray-500 mb-6">Add a pet to start tracking medical records</p>
          <Link to="/pets/add">
            <Button variant="primary" icon={<FaPlus />}>
              Add New Pet
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Pet Selection Sidebar */}
          <div className="md:col-span-3">
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-blue-500 px-4 py-3">
                <h3 className="text-white font-medium">Your Pets</h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <Link to="/medical/add">
                    <Button variant="primary" size="sm" className="w-full" icon={<FaFileMedical />}>
                      Add New Record
                    </Button>
                  </Link>
                </div>
                <ul className="space-y-2">
                  {pets.map((pet) => (
                    <li key={pet.id}>
                      <button 
                        className={`w-full flex items-center p-3 rounded-md transition-colors ${
                          selectedPet?.id === pet.id 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handlePetChange(pet)}
                      >
                        <div className="flex-shrink-0 w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-200">
                          {pet.image ? (
                            <img 
                              src={pet.image} 
                              alt={pet.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaPaw className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{pet.name}</div>
                          <div className="text-xs text-gray-500">{pet.breed}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Medical Records */}
          <div className="md:col-span-9">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-300">
                {error}
              </div>
            ) : records.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaFileMedical className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Medical Records</h3>
                <p className="text-gray-500 mb-6">Start tracking your pet's health by adding a medical record</p>
                <Link to="/medical/add">
                  <Button variant="primary" icon={<FaPlus />}>
                    Add Medical Record
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedPet?.name}'s Medical History
                  </h2>
                  <Link to="/medical/add">
                    <Button variant="primary" size="sm" icon={<FaPlus />}>
                      Add Record
                    </Button>
                  </Link>
                </div>
                
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {records.map((record) => (
                    <motion.div key={record.id} variants={itemVariants}>
                      <Card hover>
                        <CardBody>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center mb-2">
                                <FaCalendarAlt className="text-gray-500 mr-2" />
                                <span className="text-gray-600">{formatDate(record.date)}</span>
                              </div>
                              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                {record.title}
                              </h3>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {record.clinic}
                            </span>
                          </div>
                          
                          <div className="mt-3 space-y-3">
                            <div>
                              <div className="font-medium text-gray-700">Description:</div>
                              <p className="text-gray-600">{record.description}</p>
                            </div>
                            
                            <div>
                              <div className="font-medium text-gray-700">Prescription:</div>
                              <p className="text-gray-600">{record.prescription}</p>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-500">
                                Veterinarian: {record.vet}
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MedicalRecordsPage;
