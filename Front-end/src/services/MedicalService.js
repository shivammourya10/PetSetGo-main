import api from './api';

// Medical services
const MedicalService = {
  // Add medical record
  addMedicalRecord: (medicalData) => {
    return api.post('/api/medical', medicalData);
  },

  // Get medical records
  getMedicalRecords: (petId) => {
    return api.get('/api/medical', { params: { petId } });
  },
};

export default MedicalService;
