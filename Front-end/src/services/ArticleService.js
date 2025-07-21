import api from './api';

// Articles and upload services
const ArticleService = {
  // Get articles
  getArticles: () => {
    return api.get('/api/articles/vetArticles');
  },
};

// File upload service
export const UploadService = {
  // Upload file
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default ArticleService;
