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

// Forum services
const ForumService = {
  // Create a category
  createCategory: (categoryData, file) => {
    const userId = getUserIdFromStorage();
    const formData = new FormData();
    
    // Add category data
    Object.keys(categoryData).forEach(key => {
      formData.append(key, categoryData[key]);
    });
    
    // Add file if exists
    if (file) {
      formData.append('file', file);
    }
    
    return api.post(`/api/community/${userId}/createCategory`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get categories
  getCategories: () => {
    const userId = getUserIdFromStorage();
    return api.get(`/api/community/${userId}/categories`);
  },

  // Create a topic
  createTopic: (categoryId, topicData, file) => {
    const userId = getUserIdFromStorage();
    const formData = new FormData();
    
    // Add topic data
    Object.keys(topicData).forEach(key => {
      formData.append(key, topicData[key]);
    });
    
    // Add file if exists
    if (file) {
      formData.append('file', file);
    }
    
    return api.post(`/api/community/${userId}/${categoryId}/topics`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get topics for a category
  getTopics: (categoryId) => {
    const userId = getUserIdFromStorage();
    return api.get(`/api/community/${userId}/${categoryId}/topics`);
  },

  // Add reply to a topic
  addReply: (topicId, replyData) => {
    const userId = getUserIdFromStorage();
    return api.post(`/api/community/${userId}/${topicId}/reply`, replyData);
  },

  // Get topic replies (implementation still needed in backend)
  getReplies: (topicId) => {
    const userId = getUserIdFromStorage();
    return api.get(`/api/community/${userId}/topics/${topicId}/replies`);
  },

  // Update topic (implementation still needed in backend)
  updateTopic: (topicId, topicData) => {
    const userId = getUserIdFromStorage();
    return api.put(`/api/community/${userId}/topics/${topicId}`, topicData);
  },

  // Delete topic (implementation still needed in backend)
  deleteTopic: (topicId) => {
    const userId = getUserIdFromStorage();
    return api.delete(`/api/community/${userId}/topics/${topicId}`);
  },
};

export default ForumService;
