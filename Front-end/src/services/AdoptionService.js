import api from './api';

// Rescue and Adoption services
const AdoptionService = {
  // Get all pets available for adoption
  getAdoptionPets: () => {
    // Based on the backend API routes, this would fetch pets for adoption
    return api.get('/api/pets/rescueAndAdoption');
  },

  // Get single adoption pet details
  getAdoptionPet: (petId) => {
    return api.get(`/api/pets/rescueAndAdoption/${petId}`);
  },

  // Submit adoption application (now implemented in backend)
  submitAdoptionRequest: (petId, requestData) => {
    return api.post(`/api/pets/adoption/request/${petId}`, requestData);
  },

  // Get user's adoption applications (now implemented in backend)
  getUserApplications: () => {
    return api.get('/api/pets/adoption/requests');
  },

  // Get specific adoption application (now implemented in backend)
  getApplication: (applicationId) => {
    return api.get(`/api/pets/adoption/requests/${applicationId}`);
  },
  
  // List a pet for adoption or rescue
  listPetForAdoption: (petData, file) => {
    const formData = new FormData();
    
    // Add required fields based on the backend model
    // Backend expects: typeOfHelp (not 'type'), description, and a file
    formData.append('typeOfHelp', petData.type || 'Adoption'); // Backend expects 'typeOfHelp'
    formData.append('description', petData.description);
    
    // Add additional pet data
    Object.keys(petData).forEach(key => {
      if (key !== 'type' && key !== 'description') {
        formData.append(key, petData[key]);
      }
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
  }
};

export default AdoptionService;
