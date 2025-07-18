import api from './api';

// Pet Management services
const PetService = {
  // Add a new pet
  addPet: (userId, petData, file) => {
    const formData = new FormData();
    
    // Add pet data
    Object.keys(petData).forEach(key => {
      formData.append(key, petData[key]);
    });
    
    // Add file if exists
    if (file) {
      formData.append('file', file);
    }
    
    return api.post(`/api/pets/${userId}/createPets`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get user's pets
  getUserPets: (userId) => {
    return api.get(`/api/pets/${userId}/returnPets`);
  },

  // Update pet
  updatePet: (petId, petData, file) => {
    const formData = new FormData();
    
    // Add pet data
    Object.keys(petData).forEach(key => {
      formData.append(key, petData[key]);
    });
    
    // Add file if exists
    if (file) {
      formData.append('file', file);
    }
    
    return api.put(`/api/pets/${petId}/updatePet`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update breeding status
  updateBreedingStatus: (petId, status) => {
    return api.put(`/api/pets/${petId}/updateBreedingStatus`, { status });
  },

  // Add a rescue and adoption pet
  rescueAndAdoption: (petData, file) => {
    const formData = new FormData();
    
    // Add pet data
    Object.keys(petData).forEach(key => {
      formData.append(key, petData[key]);
    });
    
    // Add file if exists
    if (file) {
      formData.append('file', file);
    }
    
    return api.post('/api/pets/rescueAndAdoption', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default PetService;
