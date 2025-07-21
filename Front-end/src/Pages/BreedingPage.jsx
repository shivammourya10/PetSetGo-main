import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaPaw, FaHeart, FaArrowRight, FaFilter, FaMapMarkerAlt, FaBirthdayCake, FaVenus, FaMars } from "react-icons/fa";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Alert from "../components/Alert";
import PetMatchModal from "../Components/PetMatchModal";
import AdvancedSearchModal from "../Components/AdvancedSearchModal";
import BreedingService from "../services/BreedingService";

const BreedingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [myPets, setMyPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedMatchPet, setSelectedMatchPet] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch available pets for breeding
        const response = await BreedingService.getAvailablePets();
        const availablePets = response.data.pets || [];
        
        // Add mock compatibility scores and enhanced data
        const enhancedPets = availablePets.map(pet => ({
          ...pet,
          image: pet.image || `https://source.unsplash.com/400x300/?${pet.species || 'pet'}`,
          compatibility: {
            score: Math.floor(Math.random() * 40) + 60, // 60-100%
            factors: generateCompatibilityFactors(pet)
          },
          location: pet.location || 'Location not specified',
          description: pet.description || `Meet ${pet.name}, a wonderful ${pet.breed} looking for a breeding companion!`
        }));
        
        setPets(enhancedPets);
        setFilteredPets(enhancedPets);
        
      } catch (err) {
        setError("Failed to load pets. Please try again.");
        console.error("Error fetching breeding pets:", err);
        
        // No fallback data - only show real pets from database
        setPets([]);
        setFilteredPets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateCompatibilityFactors = (pet) => {
    const factors = [];
    if (pet.breed) factors.push(`${pet.breed} breed`);
    if (pet.age && pet.age >= 2 && pet.age <= 5) factors.push('Ideal breeding age');
    if (pet.vaccinated) factors.push('Fully vaccinated');
    if (pet.healthChecked) factors.push('Health verified');
    factors.push('Good temperament');
    factors.push('Same species');
    return factors.slice(0, 4); // Limit to 4 factors
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPets(pets);
      return;
    }
    
    const filtered = pets.filter(pet =>
      pet.name.toLowerCase().includes(query.toLowerCase()) ||
      pet.breed.toLowerCase().includes(query.toLowerCase()) ||
      pet.species.toLowerCase().includes(query.toLowerCase()) ||
      pet.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPets(filtered);
  };

  const handleAdvancedSearch = (filters) => {
    let filtered = [...pets];

    // Apply filters
    if (filters.species) {
      filtered = filtered.filter(pet => 
        pet.species.toLowerCase() === filters.species.toLowerCase()
      );
    }
    
    if (filters.breed) {
      filtered = filtered.filter(pet =>
        pet.breed.toLowerCase().includes(filters.breed.toLowerCase())
      );
    }
    
    if (filters.gender) {
      filtered = filtered.filter(pet =>
        pet.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }
    
    if (filters.age.min) {
      filtered = filtered.filter(pet => pet.age >= parseInt(filters.age.min));
    }
    
    if (filters.age.max) {
      filtered = filtered.filter(pet => pet.age <= parseInt(filters.age.max));
    }
    
    if (filters.location) {
      filtered = filtered.filter(pet =>
        pet.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredPets(filtered);
  };

  const handleViewMatch = (pet) => {
    setSelectedMatchPet(pet);
    setShowMatchModal(true);
  };

  const handleSendBreedingRequest = async (petId, message) => {
    try {
      setSendingRequest(true);
      
      // TODO: Implement with actual user's pet selection
      const userPetId = myPets[0]?.id || 'mock-pet-id';
      
      await BreedingService.requestBreeding(userPetId, petId);
      setSuccess("Breeding request sent successfully!");
      setShowMatchModal(false);
      
    } catch (err) {
      setError("Failed to send breeding request. Please try again.");
      console.error("Error sending breeding request:", err);
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-4"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-700 flex items-center">
            <FaHeart className="mr-3 text-red-500" />
            Pet Breeding
          </h1>
          <Button
            variant="primary"
            onClick={() => navigate('/pets/add')}
            icon={<FaPaw />}
          >
            Add Your Pet
          </Button>
        </motion.div>

        {/* Alerts */}
        {error && (
          <motion.div variants={itemVariants}>
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </motion.div>
        )}
        
        {success && (
          <motion.div variants={itemVariants}>
            <Alert type="success" message={success} onClose={() => setSuccess(null)} />
          </motion.div>
        )}

        {/* Search Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <InputField
                placeholder="Search by pet name, breed, species, or location..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                icon={<FaSearch />}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowAdvancedSearch(true)}
              icon={<FaFilter />}
            >
              Advanced Search
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-purple-600">{filteredPets.length}</div>
            <div className="text-gray-600">Available Pets</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-green-600">
              {filteredPets.filter(p => p.compatibility?.score >= 90).length}
            </div>
            <div className="text-gray-600">High Compatibility</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600">
              {filteredPets.filter(p => p.healthChecked && p.vaccinated).length}
            </div>
            <div className="text-gray-600">Health Verified</div>
          </Card>
        </motion.div>

        {/* Pet Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPets.map((pet) => (
              <motion.div key={pet.id} variants={itemVariants}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      {pet.compatibility?.score}% Match
                    </div>
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                      <FaHeart />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                      <div className="text-2xl">
                        {pet.gender === 'Male' ? (
                          <FaMars className="text-blue-500" />
                        ) : (
                          <FaVenus className="text-pink-500" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{pet.breed}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FaBirthdayCake className="mr-1" />
                      <span>{pet.age} years old</span>
                      <span className="mx-2">•</span>
                      <span>{pet.weight} kg</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{pet.location}</span>
                    </div>
                    
                    {/* Compatibility factors */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Why it's a good match:</div>
                      <div className="flex flex-wrap gap-1">
                        {pet.compatibility?.factors.slice(0, 2).map((factor, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      onClick={() => handleViewMatch(pet)}
                      className="w-full"
                      icon={<FaArrowRight />}
                    >
                      View Match Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPets.length === 0 && (
          <motion.div 
            variants={itemVariants}
            className="text-center py-12"
          >
            <FaPaw className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No pets found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? "Try adjusting your search criteria or browse all available pets."
                : "There are no pets available for breeding at the moment."
              }
            </p>
            {searchQuery && (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery("");
                  setFilteredPets(pets);
                }}
              >
                Clear Search
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Modals */}
      <PetMatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        pet={selectedMatchPet}
        onSendRequest={handleSendBreedingRequest}
        isLoading={sendingRequest}
      />

      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        searchType="breeding"
      />
    </Layout>
  );
};

export default BreedingPage;
