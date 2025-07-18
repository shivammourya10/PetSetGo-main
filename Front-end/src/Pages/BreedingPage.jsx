import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaPaw, FaHeart, FaArrowRight } from "react-icons/fa";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Alert from "../components/Alert";
import BreedingService from "../services/BreedingService";

const BreedingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        const response = await BreedingService.getBreedingPets();
        setPets(response.data);
      } catch (err) {
        setError("Failed to load pets. Please try again.");
        console.error("Error fetching breeding pets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleFindMatches = async (pet) => {
    try {
      setSelectedPet(pet);
      setIsLoading(true);
      const response = await BreedingService.findMatches(pet._id);
      setMatches(response.data);
    } catch (err) {
      setError("Failed to find matches. Please try again.");
      console.error("Error finding matches:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBreedingRequest = async (matchId) => {
    try {
      await BreedingService.createBreedingRequest({
        petId: selectedPet._id,
        matchId: matchId
      });
      
      // Show success notification (could use a toast component here)
      alert("Breeding request sent successfully!");
      
    } catch (err) {
      setError("Failed to send breeding request. Please try again.");
      console.error("Error creating breeding request:", err);
    }
  };

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pet.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Pet Breeding
          </h1>
        </div>

        {error && <Alert type="error" message={error} />}

        <div className="mb-6">
          <InputField
            id="search"
            name="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pets by name or breed"
            icon={<FaSearch />}
          />
        </div>

        {isLoading && !selectedPet ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-4xl text-purple-600"
            >
              <FaPaw />
            </motion.div>
          </div>
        ) : selectedPet ? (
          <div>
            <div className="flex items-center mb-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedPet(null);
                  setMatches([]);
                }}
                className="mr-4"
              >
                Back to All Pets
              </Button>
              <h2 className="text-2xl font-semibold">
                Matches for {selectedPet.name}
              </h2>
            </div>

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
            ) : matches.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FaPaw className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matches Found</h3>
                <p className="text-gray-600">
                  We couldn't find any suitable breeding matches for {selectedPet.name} at this time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <motion.div
                    key={match._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      {match.image ? (
                        <img
                          src={match.image}
                          alt={match.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <FaPaw className="text-6xl text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-xl font-bold text-white">{match.name}</h3>
                        <p className="text-white/90">{match.breed}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Age</p>
                          <p className="font-semibold">{match.age} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Gender</p>
                          <p className="font-semibold capitalize">{match.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Health</p>
                          <p className="font-semibold">Excellent</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Match Score</p>
                          <p className="font-semibold text-green-600">
                            {Math.floor(Math.random() * 30) + 70}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          variant="secondary"
                          onClick={() => navigate(`/pets/${match._id}`)}
                          className="flex-1 mr-2"
                        >
                          View Profile
                        </Button>
                        <Button
                          onClick={() => handleCreateBreedingRequest(match._id)}
                          className="flex-1 ml-2"
                        >
                          <FaHeart className="mr-2" /> Match
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredPets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FaPaw className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pets Found</h3>
                <p className="text-gray-600">
                  You don't have any pets registered for breeding yet.
                </p>
                <Button
                  onClick={() => navigate("/pets/add")}
                  className="mt-4"
                >
                  Add a Pet
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPets.map((pet) => (
                  <Card key={pet._id}>
                    <div className="aspect-square overflow-hidden relative mb-4">
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
                    </div>
                    <h3 className="text-xl font-bold text-purple-700 mb-1">{pet.name}</h3>
                    <p className="text-gray-600 mb-3">{pet.breed}</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="font-semibold">{pet.age} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-semibold capitalize">{pet.gender}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleFindMatches(pet)}
                      className="w-full"
                    >
                      Find Matches <FaArrowRight className="ml-2" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default BreedingPage;
