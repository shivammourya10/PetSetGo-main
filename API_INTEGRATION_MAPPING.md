# PetSetGo API Integration Mapping & Technical Analysis

## API Endpoint Mapping

### 🔗 Frontend Service to Backend Endpoint Mapping

#### Authentication Flow
| Frontend Service | Method | Backend Endpoint | Status | Request Body | Response |
|------------------|---------|------------------|---------|--------------|----------|
| `AuthService.register()` | POST | `/api/auth/register` | ✅ Active | `{email, password, name, phoneNo, userName}` | `{msg: "User registered successfully"}` |
| `AuthService.login()` | POST | `/api/auth/login` | ✅ Active | `{email, password}` | `{message, user, token}` |
| `AuthService.logout()` | POST | `/api/auth/logout` | ✅ Active | None (JWT in header) | `{message}` |

#### Pet Management Flow
| Frontend Service | Method | Backend Endpoint | Status | Data Type | Purpose |
|------------------|---------|------------------|---------|-----------|---------|
| `PetService.addPet()` | POST | `/api/pets/{userId}/createPets` | ✅ Active | FormData | Create new pet profile |
| `PetService.getUserPets()` | GET | `/api/pets/{userId}/returnPets` | ✅ Active | None | Get user's pet list |
| `PetService.getPet()` | GET | `/api/pets/{petId}` | ✅ Active | None | Get single pet details |
| `PetService.updatePet()` | PUT | `/api/pets/{petId}/updatePet` | ⚠️ Partial | FormData | Update pet profile |
| `PetService.deletePet()` | DELETE | `/api/pets/{petId}` | ✅ Active | None | Delete pet |

#### Adoption & Rescue Flow
| Frontend Service | Method | Backend Endpoint | Status | Data Type | Purpose |
|------------------|---------|------------------|---------|-----------|---------|
| `AdoptionService.getAdoptionPets()` | GET | `/api/pets/rescueAndAdoption` | ✅ Active | None | Browse adoption listings |
| `AdoptionService.listPetForAdoption()` | POST | `/api/pets/rescueAndAdoption` | ✅ Active | FormData | List pet for adoption |
| `AdoptionService.submitAdoptionRequest()` | POST | `/api/pets/adoption/request/{petId}` | ✅ Active | JSON | Submit adoption application |
| `AdoptionService.getUserApplications()` | GET | `/api/pets/adoption/requests` | ✅ Active | None | Get user's applications |

#### Breeding & Mating Flow
| Frontend Service | Method | Backend Endpoint | Status | Data Type | Purpose |
|------------------|---------|------------------|---------|-----------|---------|
| `BreedingService.requestBreeding()` | POST | `/api/petmate/{reqPetId}/requestBreeding/{resPetId}` | ✅ Active | JSON | Request pet breeding |
| `BreedingService.getAvailablePets()` | GET | `/api/petmate/{userId}/getPetMates` | ✅ Active | None | Get available breeding pets |
| `BreedingService.getBreedingRequests()` | GET | `/api/petmate/{userId}/pendingRequest` | ✅ Active | None | Get pending requests |
| `BreedingService.matchPets()` | POST | `/api/petmate/{breedingStatusId}/matchPets` | ✅ Active | JSON | Accept breeding match |

#### Community Forum Flow
| Frontend Service | Method | Backend Endpoint | Status | Data Type | Purpose |
|------------------|---------|------------------|---------|-----------|---------|
| `ForumService.createCategory()` | POST | `/api/community/{userId}/createCategory` | ✅ Active | FormData | Create forum category |
| `ForumService.getCategories()` | GET | `/api/community/{userId}/categories` | ✅ Active | None | Get forum categories |
| `ForumService.createTopic()` | POST | `/api/community/{userId}/{categoryId}/topics` | ✅ Active | FormData | Create discussion topic |
| `ForumService.getTopics()` | GET | `/api/community/{userId}/{categoryId}/topics` | ✅ Active | None | Get category topics |
| `ForumService.addReply()` | POST | `/api/community/{userId}/{topicId}/reply` | ✅ Active | JSON | Add topic reply |

#### Medical Records Flow
| Frontend Service | Method | Backend Endpoint | Status | Data Type | Purpose |
|------------------|---------|------------------|---------|-----------|---------|
| `MedicalService.addMedicalRecord()` | POST | `/api/medical/{petId}/medicalPresc` | ✅ Active | FormData | Upload prescription |
| `MedicalService.getMedicalRecords()` | GET | `/api/medical/{petId}/records` | ✅ Active | None | Get pet medical history |

#### File Upload & Articles Flow
| Frontend Service | Method | Backend Endpoint | Status | Data Type | Purpose |
|------------------|---------|------------------|---------|-----------|---------|
| `UploadService.uploadFile()` | POST | `/api/upload` | ✅ Active | FormData | Upload files to Cloudinary |
| `ArticleService.getArticles()` | GET | `/api/articles/vetArticles` | ✅ Active | None | Get veterinary articles |

---

## Missing API Integrations

### 🔴 High Priority - Missing Backend Implementation

#### Forum Enhancement APIs
```javascript
// These frontend calls exist but backend APIs are missing
ForumService.getReplies(topicId)          // GET /api/community/{userId}/topics/{topicId}/replies
ForumService.updateTopic(topicId, data)   // PUT /api/community/{userId}/topics/{topicId}
ForumService.deleteTopic(topicId)         // DELETE /api/community/{userId}/topics/{topicId}
```

#### Breeding System Enhancement
```javascript
// These frontend calls exist but backend APIs are missing
BreedingService.updateBreedingRequest(id, status)  // PUT /api/petmate/breeding-requests/{id}
BreedingService.deleteBreedingRequest(id)          // DELETE /api/petmate/breeding-requests/{id}
```

#### Advanced Adoption Features
```javascript
// These frontend calls exist but backend APIs need enhancement
AdoptionService.updateApplicationStatus(id, status)  // PUT /api/pets/adoption/requests/{id}/status
AdoptionService.getApplicationDetails(id)            // Enhanced GET /api/pets/adoption/requests/{id}
```

### 🟡 Medium Priority - Planned Features

#### Health & Monitoring APIs
```javascript
// Connection checking and health monitoring
api.get('/api/health')                    // Basic health check
api.get('/api/health/debug/users')        // Debug endpoint
api.get('/api/health/status')             // Detailed health status
```

#### Enhanced Pet Management
```javascript
// These would enhance existing functionality
PetService.updateBreedingStatus(petId, status)       // PUT /api/pets/{petId}/breeding-status
PetService.getBreedingHistory(petId)                 // GET /api/pets/{petId}/breeding-history
PetService.getPetHealthStats(petId)                  // GET /api/pets/{petId}/health-stats
```

#### User Profile Enhancement
```javascript
// User profile and preferences
UserService.updateProfile(userData)                  // PUT /api/users/{userId}/profile
UserService.uploadProfilePicture(file)               // POST /api/users/{userId}/profile-picture
UserService.getNotifications()                       // GET /api/users/{userId}/notifications
```

---

## Data Flow Architecture

### Authentication Flow
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   LoginPage     │───▶│   AuthService    │───▶│   Backend API   │
│   RegisterPage  │    │   - login()      │    │   /api/auth/*   │
└─────────────────┘    │   - register()   │    └─────────────────┘
                       │   - logout()     │             │
                       └──────────────────┘             │
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   AuthContext    │    │   JWT Storage   │
                       │   - user state   │    │   localStorage  │
                       │   - isAuth       │    │   - token       │
                       └──────────────────┘    │   - user data   │
                                               └─────────────────┘
```

### Pet Management Flow
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PetsPage      │───▶│   PetService     │───▶│   Backend API   │
│   AddPetPage    │    │   - addPet()     │    │   /api/pets/*   │
│   EditPetPage   │    │   - getUserPets()│    └─────────────────┘
│   PetDetailPage │    │   - updatePet()  │             │
└─────────────────┘    │   - deletePet()  │             │
                       └──────────────────┘             │
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Pet State      │    │   MongoDB       │
                       │   - pets[]       │    │   Pet Schema    │
                       │   - loading      │    │   + Cloudinary  │
                       │   - errors       │    │   (images)      │
                       └──────────────────┘    └─────────────────┘
```

---

## Technical Implementation Details

### HTTP Client Configuration
```javascript
// api.js - Axios configuration
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - JWT token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on token expiration
      localStorage.removeItem('token');
      window.location.href = '/user/login';
    }
    return Promise.reject(error);
  }
);
```

### File Upload Pattern
```javascript
// Consistent FormData pattern across services
const uploadPet = (petData, file) => {
  const formData = new FormData();
  
  // Add pet data fields
  Object.keys(petData).forEach(key => {
    formData.append(key, petData[key]);
  });
  
  // Add file with correct field name
  if (file) {
    formData.append('file', file);
  }
  
  return api.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
```

### Error Handling Strategy
```javascript
// Service-level error handling
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Backend server is not running');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication required');
    } else {
      throw new Error(error.response?.data?.message || 'Unknown error');
    }
  }
};
```

---

## Performance & Optimization Analysis

### Current Performance Issues
1. **Bundle Size**: Unused imports increasing bundle size
2. **Network Calls**: Some redundant API calls in useEffect
3. **Image Loading**: No lazy loading for pet images
4. **State Management**: No global state management (Redux/Zustand)

### Recommended Optimizations
```javascript
// 1. Implement lazy loading for images
const LazyImage = ({ src, alt }) => (
  <img 
    loading="lazy" 
    src={src} 
    alt={alt}
    onError={(e) => e.target.src = '/fallback-image.jpg'}
  />
);

// 2. Implement API response caching
const useApiCache = (key, apiCall) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
    } else {
      apiCall().then(result => {
        setData(result);
        sessionStorage.setItem(key, JSON.stringify(result));
        setLoading(false);
      });
    }
  }, [key]);
  
  return { data, loading };
};

// 3. Implement pagination for large lists
const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return { currentItems, currentPage, totalPages, setCurrentPage };
};
```

---

## Security Considerations

### Current Security Implementation
✅ **JWT Authentication**: Properly implemented with token storage
✅ **Protected Routes**: PrivateRoute component guards sensitive pages
✅ **API Authentication**: Bearer token sent with all requests
✅ **Input Validation**: Basic client-side validation

### Security Improvements Needed
🔴 **Token Refresh**: No automatic token refresh mechanism
🔴 **XSS Protection**: No Content Security Policy headers
🔴 **CSRF Protection**: No CSRF token implementation
🔴 **Rate Limiting**: Client-side rate limiting not implemented

### Recommended Security Enhancements
```javascript
// 1. Implement token refresh
const useTokenRefresh = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await api.post('/api/auth/refresh');
        localStorage.setItem('token', response.data.token);
      } catch (error) {
        // Redirect to login if refresh fails
        window.location.href = '/user/login';
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes
    
    return () => clearInterval(interval);
  }, []);
};

// 2. Implement secure storage
const secureStorage = {
  setItem: (key, value) => {
    const encrypted = btoa(JSON.stringify(value));
    localStorage.setItem(key, encrypted);
  },
  getItem: (key) => {
    const encrypted = localStorage.getItem(key);
    return encrypted ? JSON.parse(atob(encrypted)) : null;
  }
};
```

---

## Testing Strategy

### Current Testing Status
❌ **Unit Tests**: No unit tests implemented
❌ **Integration Tests**: No API integration tests
❌ **E2E Tests**: No end-to-end tests
❌ **Component Tests**: No component testing

### Recommended Testing Implementation
```javascript
// 1. API Service Tests
describe('PetService', () => {
  test('should fetch user pets successfully', async () => {
    const mockPets = [{ id: 1, name: 'Fluffy' }];
    jest.spyOn(api, 'get').mockResolvedValue({ data: { pets: mockPets } });
    
    const result = await PetService.getUserPets();
    expect(result.data.pets).toEqual(mockPets);
  });
});

// 2. Component Tests
describe('PetsPage', () => {
  test('should display pets when loaded', () => {
    render(<PetsPage />);
    expect(screen.getByText('My Pets')).toBeInTheDocument();
  });
});

// 3. E2E Tests with Cypress
describe('Pet Management Flow', () => {
  it('should allow user to add a new pet', () => {
    cy.visit('/pets');
    cy.get('[data-testid="add-pet-btn"]').click();
    cy.get('[data-testid="pet-name"]').type('Max');
    cy.get('[data-testid="submit-btn"]').click();
    cy.contains('Pet added successfully').should('be.visible');
  });
});
```

---

## Deployment Configuration

### Build Configuration
```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5173",
    "build": "vite build --mode production",
    "preview": "vite preview --port 4173",
    "lint": "eslint . --fix",
    "test": "jest",
    "test:e2e": "cypress run"
  }
}
```

### Environment Variables for Production
```env
# Production environment
VITE_API_BASE_URL=https://api.petsetgo.com
VITE_CLOUDINARY_CLOUD_NAME=petsetgo-prod
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=your_sentry_dsn
```

### Docker Configuration
```dockerfile
# Multi-stage Docker build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

This comprehensive API integration mapping provides a clear overview of the current implementation status, missing features, and future development roadmap for the PetSetGo frontend application.
