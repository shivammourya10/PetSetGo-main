import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaSearch, FaFilter, FaTh, FaList, FaEdit, FaTrash, 
  FaHeart, FaMars, FaVenus, FaBirthdayCake, FaWeight, FaMapMarkerAlt,
  FaSortAmountDown, FaSortAmountUp, FaEye, FaMedkit, FaStar
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Alert from '../components/Alert';
import AdvancedSearchModal from '../Components/AdvancedSearchModal';
import PetService from '../services/PetService';
import { useAuth } from '../context/AuthContext.jsx';

const PetsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, petId: null });

  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await PetService.getUserPets();
        // Fix: Extract pets array from response.data.data
        const userPets = response.data?.data || [];
        
        // Enhanced pets with additional data
        const enhancedPets = userPets.map(pet => ({
          ...pet,
          image: pet.image || `https://source.unsplash.com/400x400/?${pet.species?.toLowerCase() || 'pet'}`,
          healthScore: pet.healthScore || Math.floor(Math.random() * 20) + 80,
          lastCheckup: pet.lastCheckup || new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          isAvailableForBreeding: pet.isAvailableForBreeding ?? Math.random() > 0.5,
          isFavorite: pet.isFavorite ?? false,
        }));
        
        setPets(enhancedPets);
        setFilteredPets(enhancedPets);
        
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError('Failed to load your pets. Using sample data.');
        
        // Enhanced fallback data
        const mockPets = [
          { 
            id: 1, 
            name: "Buddy", 
            species: "Dog",
            breed: "Golden Retriever",
            age: 3,
            gender: "Male",
            weight: 30,
            location: "San Francisco, CA",
            healthScore: 95,
            lastCheckup: new Date('2024-01-15'),
            isAvailableForBreeding: true,
            isFavorite: true,
            vaccinated: true,
            description: "Buddy is a friendly and energetic Golden Retriever who loves playing fetch and swimming.",
            image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
          { 
            id: 2, 
            name: "Luna", 
            species: "Cat",
            breed: "Siamese",
            age: 2,
            gender: "Female",
            weight: 4,
            location: "Los Angeles, CA",
            healthScore: 88,
            lastCheckup: new Date('2024-01-10'),
            isAvailableForBreeding: false,
            isFavorite: false,
            vaccinated: true,
            description: "Luna is an elegant Siamese cat with striking blue eyes and a playful personality.",
            image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
          { 
            id: 3, 
            name: "Max", 
            species: "Dog",
            breed: "Beagle",
            age: 1,
            gender: "Male",
            weight: 12,
            location: "Seattle, WA",
            healthScore: 92,
            lastCheckup: new Date('2024-01-20'),
            isAvailableForBreeding: false,
            isFavorite: true,
            vaccinated: true,
            description: "Max is a young and curious Beagle who loves exploring and following scents.",
            image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
          { 
            id: 4, 
            name: "Bella", 
            species: "Cat",
            breed: "Persian",
            age: 4,
            gender: "Female",
            weight: 5,
            location: "New York, NY",
            healthScore: 85,
            lastCheckup: new Date('2023-12-28'),
            isAvailableForBreeding: true,
            isFavorite: false,
            vaccinated: true,
            description: "Bella is a beautiful Persian cat with luxurious fur and a calm, regal demeanor.",
            image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
        ];
        
        setPets(mockPets);
        setFilteredPets(mockPets);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [user]);

  // Filter and sort pets
  useEffect(() => {
    let filtered = [...pets];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(pet => 
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'dogs':
          filtered = filtered.filter(pet => pet.species?.toLowerCase() === 'dog');
          break;
        case 'cats':
          filtered = filtered.filter(pet => pet.species?.toLowerCase() === 'cat');
          break;
        case 'favorites':
          filtered = filtered.filter(pet => pet.isFavorite);
          break;
        case 'breeding':
          filtered = filtered.filter(pet => pet.isAvailableForBreeding);
          break;
        case 'health-checkup':
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(pet => new Date(pet.lastCheckup) < thirtyDaysAgo);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'age':
          valueA = a.age;
          valueB = b.age;
          break;
        case 'species':
          valueA = a.species?.toLowerCase() || '';
          valueB = b.species?.toLowerCase() || '';
          break;
        case 'health':
          valueA = a.healthScore;
          valueB = b.healthScore;
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredPets(filtered);
  }, [pets, searchTerm, selectedFilter, sortBy, sortOrder]);

  const handleAdvancedSearch = (filters) => {
    let filtered = [...pets];

    // Apply advanced filters
    if (filters.species) {
      filtered = filtered.filter(pet => 
        pet.species?.toLowerCase() === filters.species.toLowerCase()
      );
    }
    
    if (filters.breed) {
      filtered = filtered.filter(pet =>
        pet.breed?.toLowerCase().includes(filters.breed.toLowerCase())
      );
    }
    
    if (filters.gender) {
      filtered = filtered.filter(pet =>
        pet.gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }
    
    if (filters.age?.min) {
      filtered = filtered.filter(pet => pet.age >= parseInt(filters.age.min));
    }
    
    if (filters.age?.max) {
      filtered = filtered.filter(pet => pet.age <= parseInt(filters.age.max));
    }
    
    if (filters.location) {
      filtered = filtered.filter(pet =>
        pet.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredPets(filtered);
  };

  const handleDeletePet = async (petId) => {
    try {
      await PetService.deletePet(petId);
      setPets(pets.filter(pet => pet.id !== petId));
      setSuccess('Pet deleted successfully!');
      setDeleteModal({ show: false, petId: null });
    } catch (err) {
      setError('Failed to delete pet. Please try again.');
    }
  };

  const toggleFavorite = async (petId) => {
    try {
      const pet = pets.find(p => p.id === petId);
      const updatedPets = pets.map(p => 
        p.id === petId ? { ...p, isFavorite: !p.isFavorite } : p
      );
      setPets(updatedPets);
      
      // In a real app, you'd make an API call here
      // await PetService.updatePet(petId, { isFavorite: !pet.isFavorite });
    } catch (err) {
      setError('Failed to update favorite status.');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    <Layout title="My Pets">
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
            My Pets ({filteredPets.length})
          </h1>
          <Button
            variant="primary"
            onClick={() => navigate('/pets/add')}
            icon={<FaPlus />}
          >
            Add New Pet
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

        {/* Search and Controls */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1">
              <InputField
                placeholder="Search by name, breed, species, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<FaSearch />}
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-500'}`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-500'}`}
              >
                <FaList />
              </button>
            </div>

            {/* Advanced Search */}
            <Button
              variant="secondary"
              onClick={() => setShowAdvancedSearch(true)}
              icon={<FaFilter />}
            >
              Advanced
            </Button>
          </div>

          {/* Filter Tags and Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              {['all', 'dogs', 'cats', 'favorites', 'breeding', 'health-checkup'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedFilter === filter
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? 'All' : 
                   filter === 'health-checkup' ? 'Needs Checkup' :
                   filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="name">Name</option>
                <option value="age">Age</option>
                <option value="species">Species</option>
                <option value="health">Health Score</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pet Cards/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredPets.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || selectedFilter !== 'all' ? 'No pets found' : 'No pets yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedFilter !== 'all' 
                ? "Try adjusting your search criteria or filters."
                : "Add your first pet to get started!"
              }
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/pets/add')}
              icon={<FaPlus />}
            >
              Add Your First Pet
            </Button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredPets.map((pet) => (
              <motion.div key={pet.id || pet._id} variants={itemVariants}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay controls */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/pets/${pet.id}`)}
                          icon={<FaEye />}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => navigate(`/pets/${pet.id}/edit`)}
                          icon={<FaEdit />}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                    
                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex gap-1">
                      {pet.isFavorite && (
                        <div className="bg-red-500 text-white p-1 rounded-full">
                          <FaStar className="text-xs" />
                        </div>
                      )}
                      {pet.isAvailableForBreeding && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                          Breeding
                        </div>
                      )}
                    </div>
                    
                    {/* Health score */}
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold">
                      <FaMedkit className="inline mr-1 text-green-500" />
                      {pet.healthScore}%
                    </div>

                    {/* Favorite toggle */}
                    <button
                      onClick={() => toggleFavorite(pet.id)}
                      className="absolute bottom-3 right-3 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      <FaHeart className={`${pet.isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
                    </button>
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
                      <FaWeight className="mr-1" />
                      <span>{pet.weight} kg</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{pet.location}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      Last checkup: {formatDate(pet.lastCheckup)}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/pets/${pet.id}`)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteModal({ show: true, petId: pet.id })}
                        icon={<FaTrash />}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // List View
          <motion.div variants={containerVariants} className="space-y-4">
            {filteredPets.map((pet) => (
              <motion.div key={pet.id || pet._id} variants={itemVariants}>
                <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-4">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
                        {pet.isFavorite && <FaStar className="text-red-500 text-sm" />}
                        {pet.gender === 'Male' ? (
                          <FaMars className="text-blue-500" />
                        ) : (
                          <FaVenus className="text-pink-500" />
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-1">{pet.breed} • {pet.species}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{pet.age} years old</span>
                        <span>{pet.weight} kg</span>
                        <span>{pet.location}</span>
                        <span className="flex items-center">
                          <FaMedkit className="mr-1 text-green-500" />
                          {pet.healthScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/pets/${pet.id}`)}
                        icon={<FaEye />}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/pets/${pet.id}/edit`)}
                        icon={<FaEdit />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteModal({ show: true, petId: pet.id })}
                        icon={<FaTrash />}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        searchType="pets"
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Delete Pet</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this pet? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteModal({ show: false, petId: null })}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeletePet(deleteModal.petId)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default PetsPage;
