import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPaw, FaHeart, FaEye, FaTimes, FaMapMarkerAlt, FaBirthdayCake, FaWeight } from 'react-icons/fa';
import Button from '../components/Button';

const PetMatchModal = ({ isOpen, onClose, pet, onSendRequest, isLoading }) => {
  const [requestMessage, setRequestMessage] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRequestMessage(`Hi! I'm interested in arranging a breeding meetup between my pet and ${pet?.name}. Could we discuss this further?`);
    }
  }, [isOpen, pet]);

  if (!isOpen || !pet) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSendRequest(pet.id, requestMessage);
    onClose();
  };

  const compatibility = pet.compatibility || {
    score: Math.floor(Math.random() * 40) + 60, // 60-100%
    factors: ['Same breed', 'Similar age', 'Compatible temperament', 'Same location']
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="relative">
          <img
            src={pet.image || `https://source.unsplash.com/400x300/?${pet.species}`}
            alt={pet.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all"
          >
            <FaTimes className="text-gray-600" />
          </button>
          
          {/* Compatibility Badge */}
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {compatibility.score}% Match
          </div>
        </div>

        {/* Pet Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaPaw className="mr-2 text-purple-600" />
              {pet.name}
            </h2>
            <div className="flex items-center text-red-500">
              <FaHeart className="mr-1" />
              <span className="text-sm font-medium">Available for Breeding</span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-500">Species</div>
              <div className="font-semibold">{pet.species}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Breed</div>
              <div className="font-semibold">{pet.breed}</div>
            </div>
            <div className="text-center flex items-center justify-center">
              <FaBirthdayCake className="mr-1 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Age</div>
                <div className="font-semibold">{pet.age} years</div>
              </div>
            </div>
            <div className="text-center flex items-center justify-center">
              <FaWeight className="mr-1 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Weight</div>
                <div className="font-semibold">{pet.weight || 'N/A'} kg</div>
              </div>
            </div>
          </div>

          {/* Location */}
          {pet.location && (
            <div className="flex items-center mb-4 text-gray-600">
              <FaMapMarkerAlt className="mr-2" />
              <span>{pet.location}</span>
            </div>
          )}

          {/* Compatibility Factors */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Why this is a good match:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {compatibility.factors.map((factor, index) => (
                <div key={index} className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {pet.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">About {pet.name}</h3>
              <div className="text-gray-600">
                {showFullDescription ? (
                  <p>{pet.description}</p>
                ) : (
                  <p>{pet.description.substring(0, 150)}...</p>
                )}
                {pet.description.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-purple-600 hover:text-purple-800 mt-1 flex items-center"
                  >
                    <FaEye className="mr-1" />
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Health Info */}
          {pet.healthInfo && (
            <div className="mb-6 bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-800">Health Information</h3>
              <div className="text-green-700">
                <p>✅ Vaccinated</p>
                <p>✅ Health Checked</p>
                <p>✅ Breeding Ready</p>
              </div>
            </div>
          )}

          {/* Breeding Request Form */}
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold mb-3">Send Breeding Request</h3>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              placeholder="Write a message to the pet owner..."
              required
            />
            
            <div className="flex space-x-3">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Sending...' : 'Send Breeding Request'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PetMatchModal;
