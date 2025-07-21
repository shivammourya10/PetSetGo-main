import api from './api';

// Medical services
const MedicalService = {
  // Add medical record (prescription upload)
  addMedicalRecord: (petId, file) => {
    const formData = new FormData();
    
    // The backend expects a file field named 'Prescerption' (note the typo in backend)
    if (file) {
      formData.append('Prescerption', file);
    }
    
    return api.post(`/api/medical/${petId}/medicalPresc`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get medical records for a pet (now implemented in backend)
  getMedicalRecords: (petId) => {
    return api.get(`/api/medical/${petId}/records`);
  },

  // Alternative method for adding medical data with other fields
  addMedicalRecordWithData: (petId, medicalData, file) => {
    const formData = new FormData();
    
    // Add medical data fields
    Object.keys(medicalData).forEach(key => {
      formData.append(key, medicalData[key]);
    });
    
    // Add prescription file
    if (file) {
      formData.append('Prescerption', file);
    }
    
    return api.post(`/api/medical/${petId}/medicalPresc`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default MedicalService;
