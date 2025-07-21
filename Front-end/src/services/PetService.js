import api from './api';

// Helper function to get user ID from storage
const getUserIdFromStorage = () => {
  try {
    // Check if token exists first
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error('User data not found');
    }
    
    const user = JSON.parse(userData);
    const userId = user._id || user.id;
    
    if (!userId) {
      throw new Error('User ID not found in stored profile');
    }
    
    console.log('Using user ID:', userId);
    return userId;
  } catch (error) {
    console.error('Error getting user ID from storage:', error);
    // Clear localStorage to force re-login if data is corrupted
    if (error.message.includes('JSON')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    throw new Error('Authentication issue: Please login again.');
  }
};

// Pet Management services
const PetService = {
  // Add a new pet
  addPet: (petData, file) => {
    const formData = new FormData();
    
    // Get user ID from localStorage instead of parameter
    const userId = getUserIdFromStorage();
    
    console.log("PetService.addPet received:", { 
      userId, 
      petData: { ...petData },
      file: file ? `${file.name} (${file.type}, ${file.size} bytes)` : "No file"
    });
    
    // Add pet data with proper field names according to backend expectations
    formData.append('name', petData.name);  // Backend expects 'name' in req.body
    formData.append('type', petData.type);  // Backend expects 'type' in req.body
    formData.append('breed', petData.breed);
    formData.append('age', petData.age);
    formData.append('gender', petData.gender);
    formData.append('weight', petData.weight);
    formData.append('availableForBreeding', petData.availableForBreeding);
    
    if (petData.description) {
      formData.append('description', petData.description);
    }
    
    // Add file - this is critical for the backend
    if (!file) {
      console.error("No file provided for upload - this will cause an error on the server");
      throw new Error("No file provided for upload");
    }
    
    // The 'file' field name must match what the multer middleware expects on the server
    formData.append('file', file);
    console.log("File appended to form data:", file.name);
    
    // Debug: Verify FormData contents
    let formDataEntries = [];
    for (let [key, value] of formData.entries()) {
      formDataEntries.push({
        key,
        value: value instanceof File ? 
          `File: ${value.name} (${value.size} bytes, ${value.type})` : value
      });
    }
    console.log("FormData complete contents:", formDataEntries);
    
    // Send the request with multipart/form-data header
    console.log(`Making API request to: http://localhost:3000/api/pets/${userId}/createPets`);
    
    return api.post(`/api/pets/${userId}/createPets`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Add more debugging and timeout options
      timeout: 30000, // Increase timeout to 30 seconds
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    }).catch(error => {
      // Enhanced error logging
      console.error('PetService.addPet error details:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response',
        request: error.request ? 'Request was made but no response received' : 'Request setup failed'
      });
      
      // Rethrow the error with enhanced message
      throw error;
    });
  },

  // Get user's pets
  getUserPets: () => {
    const userId = getUserIdFromStorage();
    return api.get(`/api/pets/${userId}/returnPets`);
  },

  // Get single pet details (now implemented in backend)
  getPet: (petId) => {
    return api.get(`/api/pets/${petId}`);
  },

  // Delete pet (now implemented in backend)
  deletePet: (petId) => {
    return api.delete(`/api/pets/${petId}`);
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
    
    // Backend expects 'typeOfHelp' and 'description' fields
    formData.append('typeOfHelp', petData.type || 'Adoption');
    formData.append('description', petData.description);
    
    // Add other pet data
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
  },
  
  // Debug method to check authentication status
  checkAuthStatus: () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token) {
        return {
          isAuthenticated: false,
          message: 'No authentication token found',
          recommendation: 'Please login again'
        };
      }
      
      if (!userData) {
        return {
          isAuthenticated: false, 
          hasToken: true,
          message: 'Token exists but no user data found',
          recommendation: 'Please login again'
        };
      }
      
      try {
        const user = JSON.parse(userData);
        const userId = user._id || user.id;
        
        return {
          isAuthenticated: !!userId,
          user: {
            id: userId,
            name: user.name || 'Unknown',
            email: user.email || 'Unknown'
          },
          token: `${token.substring(0, 10)}...`,
          message: userId ? 'Authentication valid' : 'User ID missing from profile'
        };
      } catch (e) {
        return {
          isAuthenticated: false,
          hasToken: true,
          error: e.message,
          message: 'Failed to parse user data',
          recommendation: 'Please login again'
        };
      }
    } catch (error) {
      return {
        isAuthenticated: false,
        error: error.message,
        message: 'Authentication check failed',
        recommendation: 'Please login again'
      };
    }
  }
};

export default PetService;
