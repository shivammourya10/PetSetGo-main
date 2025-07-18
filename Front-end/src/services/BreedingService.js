import api from './api';

// Breeding services
const BreedingService = {
  // Request breeding
  requestBreeding: (breedingData) => {
    return api.post('/api/breeding', breedingData);
  },

  // Get breeding requests
  getBreedingRequests: () => {
    return api.get('/api/breeding');
  },

  // Update breeding request
  updateBreedingRequest: (id, status) => {
    return api.put(`/api/breeding/${id}`, { status });
  },

  // Delete breeding request
  deleteBreedingRequest: (id) => {
    return api.delete(`/api/breeding/${id}`);
  },
};

export default BreedingService;
