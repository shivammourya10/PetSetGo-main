import api from './api';

// Forum services
const ForumService = {
  // Create a topic
  createTopic: (topicData) => {
    return api.post('/api/forum/topics', topicData);
  },

  // Get topics
  getTopics: (filters = {}) => {
    return api.get('/api/forum/topics', { params: filters });
  },

  // Update topic
  updateTopic: (id, topicData) => {
    return api.put(`/api/forum/topics/${id}`, topicData);
  },

  // Delete topic
  deleteTopic: (id) => {
    return api.delete(`/api/forum/topics/${id}`);
  },

  // Add reply
  addReply: (replyData) => {
    return api.post('/api/forum/replies', replyData);
  },

  // Get replies
  getReplies: (topicId) => {
    return api.get('/api/forum/replies', { params: { topicId } });
  },
};

export default ForumService;
