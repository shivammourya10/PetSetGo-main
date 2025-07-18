import api from './api';

// Adoption services
const AdoptionService = {
  // Get all pets available for adoption
  getAdoptionPets: () => {
    return api.get('/api/adoption/pets');
  },

  // Get single adoption pet details
  getAdoptionPet: (petId) => {
    return api.get(`/api/adoption/pets/${petId}`);
  },

  // Submit adoption application
  submitAdoptionRequest: (data) => {
    return api.post('/api/adoption/request', data);
  },

  // Get user's adoption applications
  getUserApplications: () => {
    return api.get('/api/adoption/applications');
  },

  // Get specific adoption application
  getApplication: (applicationId) => {
    return api.get(`/api/adoption/applications/${applicationId}`);
  },
  
  // List a pet for adoption
  listPetForAdoption: (petData) => {
    return api.post('/api/adoption/list', petData);
  }
};

export default AdoptionService;
