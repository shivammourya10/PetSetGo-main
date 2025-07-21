import api from './api';

// Helper function to get user ID from storage
const getUserIdFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error('User data not found');
    }
    const user = JSON.parse(userData);
    return user._id || user.id;
  } catch (error) {
    console.error('Error getting user ID from storage:', error);
    throw new Error('Authentication issue: Please login again.');
  }
};

// Breeding services
const BreedingService = {
  // Request breeding between two pets
  requestBreeding: (reqPetId, resPetId) => {
    return api.post(`/api/petmate/${reqPetId}/requestBreeding/${resPetId}`);
  },

  // Get available pets for breeding
  getAvailablePets: () => {
    const userId = getUserIdFromStorage();
    return api.get(`/api/petmate/${userId}/getPetMates`);
  },

  // Get breeding requests for user
  getBreedingRequests: () => {
    const userId = getUserIdFromStorage();
    return api.get(`/api/petmate/${userId}/pendingRequest`);
  },

  // Match pets (accept breeding request)
  matchPets: (breedingStatusId) => {
    return api.post(`/api/petmate/${breedingStatusId}/matchPets`);
  },

  // Update breeding request status (implementation needed in backend)
  updateBreedingRequest: (id, status) => {
    return api.put(`/api/petmate/breeding-requests/${id}`, { status });
  },

  // Delete breeding request (implementation needed in backend)
  deleteBreedingRequest: (id) => {
    return api.delete(`/api/petmate/breeding-requests/${id}`);
  },
};

export default BreedingService;
