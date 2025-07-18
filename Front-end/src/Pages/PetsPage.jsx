import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import PetService from '../services/PetService';
import { useAuth } from '../context/AuthContext.jsx';

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        const response = await PetService.getUserPets(user.id);
        setPets(response.data);
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError('Failed to load your pets. Please try again later.');
        // Use dummy data as fallback
        setPets([
          { 
            id: 1, 
            name: "Buddy", 
            species: "Dog",
            breed: "Golden Retriever",
            age: 3,
            gender: "Male",
            image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
          { 
            id: 2, 
            name: "Luna", 
            species: "Cat",
            breed: "Siamese",
            age: 2,
            gender: "Female",
            image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
          { 
            id: 3, 
            name: "Max", 
            species: "Dog",
            breed: "Beagle",
            age: 1,
            gender: "Male",
            image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
          { 
            id: 4, 
            name: "Bella", 
            species: "Cat",
            breed: "Persian",
            age: 4,
            gender: "Female",
            image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [user]);

  // Filter pets based on search term
  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <Layout title="My Pets">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-6">
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search pets by name, species, or breed"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Add pet button */}
          <Link to="/pets/add">
            <Button variant="primary" icon={<FaPlus />}>
              Add New Pet
            </Button>
          </Link>
        </div>

        {/* Filter tags - optional */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center text-gray-700">
            <FaFilter className="mr-1 text-gray-500" />
            <span>Filters</span>
          </div>
          <button className="bg-blue-100 rounded-full px-3 py-1 text-sm flex items-center text-blue-700">
            Dogs
            <span className="ml-1 text-xs">✕</span>
          </button>
          <button className="bg-blue-100 rounded-full px-3 py-1 text-sm flex items-center text-blue-700">
            Cats
            <span className="ml-1 text-xs">✕</span>
          </button>
        </div>

        {/* Pet Cards */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : error && pets.length === 0 ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-300 mb-6">
            {error}
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No pets found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or add a new pet</p>
            <Link to="/pets/add">
              <Button variant="primary" icon={<FaPlus />}>
                Add New Pet
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPets.map((pet) => (
              <motion.div key={pet.id} variants={itemVariants}>
                <Link to={`/pets/${pet.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300" hover>
                    <div className="h-48 overflow-hidden">
                      {pet.image ? (
                        <img 
                          src={pet.image} 
                          alt={pet.name} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-6xl">🐾</span>
                        </div>
                      )}
                    </div>
                    <CardBody>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">{pet.name}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {pet.species}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Breed:</span> {pet.breed || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Age:</span> {pet.age} {pet.age === 1 ? 'year' : 'years'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Gender:</span> {pet.gender}
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default PetsPage;
