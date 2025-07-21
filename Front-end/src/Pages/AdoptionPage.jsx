import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaPaw, FaHeart, FaFilter, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Alert from "../components/Alert";
import AdoptionService from "../services/AdoptionService";
import { useAuth } from "../context/AuthContext";

const AdoptionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    species: "all",
    age: "all",
    gender: "all",
    distance: 50
  });

  // Fetch adoption listings
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        // Make API call to get pets available for adoption
        const response = await AdoptionService.getAdoptionPets();
        setPets(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching adoption pets:", err);
        setError("Failed to load adoption listings. Please try again.");
        
        // No dummy data - only show real pets from database
        setPets([]);
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleFavorite = (petId) => {
    // Handle adding to favorites
    console.log("Added to favorites:", petId);
  };

  const handleAdoptionRequest = (petId) => {
    // Navigate to adoption form
    navigate(`/adoption/request/${petId}`);
  };

  // Filter pets based on search and filters
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecies = filters.species === "all" || pet.species === filters.species;
    
    let matchesAge = true;
    if (filters.age === "puppy") matchesAge = pet.age < 1;
    else if (filters.age === "young") matchesAge = pet.age >= 1 && pet.age <= 3;
    else if (filters.age === "adult") matchesAge = pet.age > 3;
    
    const matchesGender = filters.gender === "all" || pet.gender === filters.gender;
    
    const matchesDistance = pet.distance <= parseInt(filters.distance);
    
    return matchesSearch && matchesSpecies && matchesAge && matchesGender && matchesDistance;
  });

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
          <h1 className="text-3xl font-bold text-purple-700 flex-grow">
            Adopt a Pet
          </h1>
          <div className="flex space-x-3">
            {user && (
              <Button
                variant="primary"
                onClick={() => navigate('/adoption/list')}
              >
                <FaPlus className="mr-2" /> List Pet
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" /> Filters
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants}>
            <Alert type="error" message={error} />
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mb-6">
          <InputField
            id="search"
            name="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, breed, or location"
            icon={<FaSearch />}
          />
        </motion.div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Species
                </label>
                <select
                  name="species"
                  value={filters.species}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Species</option>
                  <option value="dog">Dogs</option>
                  <option value="cat">Cats</option>
                  <option value="bird">Birds</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Age
                </label>
                <select
                  name="age"
                  value={filters.age}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Ages</option>
                  <option value="puppy">Baby/Puppy (&lt; 1 year)</option>
                  <option value="young">Young (1-3 years)</option>
                  <option value="adult">Adult (&gt; 3 years)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Distance (miles)
                </label>
                <input
                  type="range"
                  name="distance"
                  min="5"
                  max="100"
                  value={filters.distance}
                  onChange={handleFilterChange}
                  className="w-full"
                />
                <div className="text-center mt-1">{filters.distance} miles</div>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-4xl text-purple-600"
            >
              <FaPaw />
            </motion.div>
          </div>
        ) : filteredPets.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <FaPaw className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pets Found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria to find more pets available for adoption.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPets.map((pet) => (
              <motion.div key={pet._id} variants={itemVariants}>
                <Card>
                  <div className="aspect-video overflow-hidden rounded-t-lg relative">
                    {pet.image ? (
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
                    <button
                      onClick={() => handleFavorite(pet._id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                    >
                      <FaHeart className="text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-purple-700">{pet.name}</h3>
                      <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        {pet.species === "dog" ? "Dog" : pet.species === "cat" ? "Cat" : pet.species}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{pet.breed}</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="font-semibold">{pet.age} {pet.age === 1 ? "year" : "years"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-semibold capitalize">{pet.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <FaMapMarkerAlt className="text-gray-500 mr-1" />
                      <p className="text-sm text-gray-600">{pet.location} ({pet.distance} miles)</p>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-2">{pet.description}</p>
                    <Button
                      onClick={() => handleAdoptionRequest(pet._id)}
                      className="w-full"
                    >
                      Adopt Me
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default AdoptionPage;
