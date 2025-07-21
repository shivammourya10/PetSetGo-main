import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaMapMarkerAlt, FaPaw } from 'react-icons/fa';
import InputField from '../components/InputField';
import Button from '../components/Button';

const AdvancedSearchModal = ({ isOpen, onClose, onSearch, searchType = 'pets' }) => {
  const [filters, setFilters] = useState({
    // Common filters
    location: '',
    distance: 25,
    
    // Pet-specific filters
    species: '',
    breed: '',
    age: {
      min: '',
      max: ''
    },
    gender: '',
    size: '',
    temperament: [],
    healthStatus: '',
    
    // Breeding-specific filters
    availableForBreeding: false,
    vaccinated: false,
    healthChecked: false,
    
    // Adoption-specific filters
    goodWithKids: false,
    goodWithPets: false,
    housebroken: false,
    energyLevel: '',
    
    // Forum-specific filters
    category: '',
    dateRange: '',
    hasReplies: false,
    
    // Article-specific filters
    articleCategory: '',
    author: '',
    source: ''
  });

  const [selectedTemperaments, setSelectedTemperaments] = useState([]);

  const temperamentOptions = [
    'Friendly', 'Energetic', 'Calm', 'Playful', 'Gentle', 'Alert', 
    'Independent', 'Social', 'Protective', 'Loyal', 'Intelligent', 'Quiet'
  ];

  const speciesOptions = [
    'Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Rodent', 'Other'
  ];

  const sizeOptions = [
    'Small (0-25 lbs)', 'Medium (26-60 lbs)', 'Large (61-100 lbs)', 'Giant (100+ lbs)'
  ];

  const energyLevels = [
    'Low', 'Moderate', 'High', 'Very High'
  ];

  useEffect(() => {
    setFilters(prev => ({ ...prev, temperament: selectedTemperaments }));
  }, [selectedTemperaments]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFilters(prev => ({ ...prev, [name]: checked }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTemperamentToggle = (temperament) => {
    setSelectedTemperaments(prev => 
      prev.includes(temperament)
        ? prev.filter(t => t !== temperament)
        : [...prev, temperament]
    );
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      location: '',
      distance: 25,
      species: '',
      breed: '',
      age: { min: '', max: '' },
      gender: '',
      size: '',
      temperament: [],
      healthStatus: '',
      availableForBreeding: false,
      vaccinated: false,
      healthChecked: false,
      goodWithKids: false,
      goodWithPets: false,
      housebroken: false,
      energyLevel: '',
      category: '',
      dateRange: '',
      hasReplies: false,
      articleCategory: '',
      author: '',
      source: ''
    });
    setSelectedTemperaments([]);
  };

  if (!isOpen) return null;

  const renderPetFilters = () => (
    <>
      {/* Species & Breed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Species</label>
          <select
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Any Species</option>
            {speciesOptions.map(species => (
              <option key={species} value={species}>{species}</option>
            ))}
          </select>
        </div>
        
        <InputField
          label="Breed"
          name="breed"
          value={filters.breed}
          onChange={handleFilterChange}
          placeholder="e.g., Golden Retriever"
        />
      </div>

      {/* Age Range */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Age Range (years)</label>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            name="age.min"
            type="number"
            value={filters.age.min}
            onChange={handleFilterChange}
            placeholder="Min age"
            min="0"
          />
          <InputField
            name="age.max"
            type="number"
            value={filters.age.max}
            onChange={handleFilterChange}
            placeholder="Max age"
            min="0"
          />
        </div>
      </div>

      {/* Gender & Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Gender</label>
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Size</label>
          <select
            name="size"
            value={filters.size}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Any Size</option>
            {sizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Temperament */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Temperament</label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {temperamentOptions.map(temperament => (
            <button
              key={temperament}
              type="button"
              onClick={() => handleTemperamentToggle(temperament)}
              className={`px-3 py-2 text-sm rounded-full border transition-all ${
                selectedTemperaments.includes(temperament)
                  ? 'bg-purple-100 border-purple-500 text-purple-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300'
              }`}
            >
              {temperament}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const renderBreedingFilters = () => (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Breeding Requirements</label>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="availableForBreeding"
            checked={filters.availableForBreeding}
            onChange={handleFilterChange}
            className="mr-2"
          />
          Available for breeding
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="vaccinated"
            checked={filters.vaccinated}
            onChange={handleFilterChange}
            className="mr-2"
          />
          Vaccinated
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="healthChecked"
            checked={filters.healthChecked}
            onChange={handleFilterChange}
            className="mr-2"
          />
          Health checked
        </label>
      </div>
    </div>
  );

  const renderAdoptionFilters = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Good With</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="goodWithKids"
              checked={filters.goodWithKids}
              onChange={handleFilterChange}
              className="mr-2"
            />
            Children
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="goodWithPets"
              checked={filters.goodWithPets}
              onChange={handleFilterChange}
              className="mr-2"
            />
            Other pets
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="housebroken"
              checked={filters.housebroken}
              onChange={handleFilterChange}
              className="mr-2"
            />
            House-trained
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Energy Level</label>
        <select
          name="energyLevel"
          value={filters.energyLevel}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Any Energy Level</option>
          {energyLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaSearch className="mr-3 text-purple-600" />
            Advanced Search
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Location */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-gray-600" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City, State or ZIP code"
              />
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Distance: {filters.distance} miles
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
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5 miles</span>
                  <span>100+ miles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pet-specific filters */}
          {(searchType === 'pets' || searchType === 'breeding' || searchType === 'adoption') && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FaPaw className="mr-2 text-gray-600" />
                Pet Details
              </h3>
              {renderPetFilters()}
            </div>
          )}

          {/* Breeding-specific filters */}
          {searchType === 'breeding' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Breeding Specific</h3>
              {renderBreedingFilters()}
            </div>
          )}

          {/* Adoption-specific filters */}
          {searchType === 'adoption' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Adoption Preferences</h3>
              {renderAdoptionFilters()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Reset Filters
          </Button>
          <div className="space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedSearchModal;
