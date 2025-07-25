# PetSetGo Backend API

A comprehensive RESTful API for pet care management, built with Node.js, Express, and MongoDB. This backend provides features for pet management, breeding coordination, community forums, medical records, and veterinary resources.

## 🚀 Features

- **User Authentication** - JWT-based secure authentication
- **Pet Management** - CRUD operations for pet profiles
- **Pet Breeding System** - Matching and breeding request management
- **Community Forum** - Discussion categories, topics, and replies
- **Medical Records** - Digital prescription storage
- **Veterinary Articles** - News and tips from external APIs
- **File Upload** - Cloudinary integration for image storage
- **Input Validation** - Zod schema validation
- **Rate Limiting** - Login attempt protection

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary account
- NewsAPI account (for vet articles)

## 🛠️ Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd PetSetGo-main/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/petsetgo

# JWT Configuration
ACCESS_TOKEN_SECRET=your_super_secret_jwt_key_min_32_chars
ACCESS_TOKEN_EXPIRY=1d

# Cloudinary Configuration
CLOUDINARY_API_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# NewsAPI Configuration
NEWSAPI_KEY=your_newsapi_key
```

4. **Create required directories**
```bash
mkdir -p public/temp
```

5. **Start the server**
```bash
# Development mode
nodemon src/index.js

# Production mode
node src/index.js
```

The server will be running at `http://localhost:3000`

## 📚 Complete API Documentation

### Base URL
- **URL**: `http://localhost:3000`
### Authentication

#### Register

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **201 Created**: User registered successfully
  - **400 Bad Request**: Invalid input data
  - **500 Server Error**: Registration failed

#### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **200 OK**: Login successful, returns user data and access token
  - **401 Unauthorized**: Invalid credentials
  - **500 Server Error**: Login failed

### Pet Management

#### Add Pet

- **URL**: `/api/pets`
- **Method**: `POST`
- **Description**: Add a new pet
- **Request Body**:
  ```json
  {
    "name": "string",
    "species": "string",
    "breed": "string",
    "age": "number",
    "owner": "user_id"
  }
  ```
- **Response**:
  - **201 Created**: Pet added successfully
  - **400 Bad Request**: Invalid input data
  - **500 Server Error**: Adding pet failed

#### Get Pets

- **URL**: `/api/pets`
- **Method**: `GET`
- **Description**: Get a list of pets
- **Response**:
  - **200 OK**: Returns an array of pets
  - **500 Server Error**: Fetching pets failed

#### Update Pet

- **URL**: `/api/pets/:id`
- **Method**: `PUT`
- **Description**: Update a pet's information
- **Request Body**:
  ```json
  {
    "name": "string",
    "species": "string",
    "breed": "string",
    "age": "number"
  }
  ```
- **Response**:
  - **200 OK**: Pet updated successfully
  - **400 Bad Request**: Invalid input data
  - **404 Not Found**: Pet not found
  - **500 Server Error**: Updating pet failed

#### Delete Pet

- **URL**: `/api/pets/:id`
- **Method**: `DELETE`
- **Description**: Delete a pet
- **Response**:
  - **204 No Content**: Pet deleted successfully
  - **404 Not Found**: Pet not found
  - **500 Server Error**: Deleting pet failed

### Breeding Management

#### Request Breeding

- **URL**: `/api/breeding`
- **Method**: `POST`
- **Description**: Request a breeding
- **Request Body**:
  ```json
  {
    "petId": "string",
    "mateId": "string"
  }
  ```
- **Response**:
  - **201 Created**: Breeding requested successfully
  - **400 Bad Request**: Invalid input data
  - **500 Server Error**: Requesting breeding failed

#### Get Breeding Requests

- **URL**: `/api/breeding`
- **Method**: `GET`
- **Description**: Get a list of breeding requests
- **Response**:
  - **200 OK**: Returns an array of breeding requests
  - **500 Server Error**: Fetching breeding requests failed

#### Update Breeding Request

- **URL**: `/api/breeding/:id`
- **Method**: `PUT`
- **Description**: Update a breeding request
- **Request Body**:
  ```json
  {
    "status": "string"
  }
  ```
- **Response**:
  - **200 OK**: Breeding request updated successfully
  - **400 Bad Request**: Invalid input data
  - **404 Not Found**: Breeding request not found
  - **500 Server Error**: Updating breeding request failed

#### Delete Breeding Request

- **URL**: `/api/breeding/:id`
- **Method**: `DELETE`
- **Description**: Delete a breeding request
- **Response**:
  - **204 No Content**: Breeding request deleted successfully
  - **404 Not Found**: Breeding request not found
  - **500 Server Error**: Deleting breeding request failed

### Forum Management

#### Create Topic

- **URL**: `/api/forum/topics`
- **Method**: `POST`
- **Description**: Create a new forum topic
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "category": "string",
    "author": "user_id"
  }
  ```
- **Response**:
  - **201 Created**: Topic created successfully
  - **400 Bad Request**: Invalid input data
  - **500 Server Error**: Creating topic failed

#### Get Topics

- **URL**: `/api/forum/topics`
- **Method**: `GET`
- **Description**: Get a list of forum topics
- **Response**:
  - **200 OK**: Returns an array of forum topics
  - **500 Server Error**: Fetching topics failed

#### Update Topic

- **URL**: `/api/forum/topics/:id`
- **Method**: `PUT`
- **Description**: Update a forum topic
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string"
  }
  ```
- **Response**:
  - **200 OK**: Topic updated successfully
  - **400 Bad Request**: Invalid input data
  - **404 Not Found**: Topic not found
  - **500 Server Error**: Updating topic failed

#### Delete Topic

- **URL**: `/api/forum/topics/:id`
- **Method**: `DELETE`
- **Description**: Delete a forum topic
- **Response**:
  - **204 No Content**: Topic deleted successfully
  - **404 Not Found**: Topic not found
  - **500 Server Error**: Deleting topic failed

#### Add Reply

- **URL**: `/api/forum/replies`
- **Method**: `POST`
- **Description**: Add a reply to a topic
- **Request Body**:
  ```json
  {
    "topicId": "string",
    "content": "string",
    "author": "user_id"
  }
  ```
- **Response**:
  - **201 Created**: Reply added successfully
  - **400 Bad Request**: Invalid input data
  - **500 Server Error**: Adding reply failed

#### Get Replies

- **URL**: `/api/forum/replies`
- **Method**: `GET`
- **Description**: Get replies for a topic
- **Response**:
  - **200 OK**: Returns an array of replies
  - **500 Server Error**: Fetching replies failed

### Medical Records

#### Add Medical Record

- **URL**: `/api/medical`
- **Method**: `POST`
- **Description**: Add a medical record for a pet
- **Request Body**:
  ```json
  {
    "petId": "string",
    "date": "string",
    "description": "string",
    "prescription": "string"
  }
  ```
- **Response**:
  - **201 Created**: Medical record added successfully
  - **400 Bad Request**: Invalid input data
  - **500 Server Error**: Adding medical record failed

#### Get Medical Records

- **URL**: `/api/medical`
- **Method**: `GET`
- **Description**: Get medical records for a pet
- **Response**:
  - **200 OK**: Returns an array of medical records
  - **500 Server Error**: Fetching medical records failed

### Veterinary Articles

#### Get Articles

- **URL**: `/api/articles`
- **Method**: `GET`
- **Description**: Get a list of veterinary articles
- **Response**:
  - **200 OK**: Returns an array of articles
  - **500 Server Error**: Fetching articles failed

### File Upload

#### Upload File

- **URL**: `/api/upload`
- **Method**: `POST`
- **Description**: Upload a file
- **Request Body**: `form-data`
  - **file**: The file to upload
- **Response**:
  - **200 OK**: Returns the uploaded file's information
  - **400 Bad Request**: Invalid file
  - **500 Server Error**: File upload failed

## 🔑 Authentication & Authorization

- All endpoints except **/api/auth/register** and **/api/auth/login** require authentication.
- Use the `Authorization` header with the `Bearer` scheme to access protected routes.

## 📦 Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image and file storage
- **Zod** - TypeScript-first schema validation
- **Nodemon** - Development tool for auto-restarting the server

## 🧪 Testing

- **Postman** - API testing
- **Jest** - JavaScript testing framework
- **Supertest** - HTTP assertions for testing

## 📈 API Rate Limiting

- Rate limiting is applied to the login endpoint to prevent brute-force attacks.
- Configurable in the `src/middleware/rateLimiter.js` file.

## 📂 Project Structure

```
PetSetGo-main/
├── backend/
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── tests/               # Test files
│   ├── uploads/             # Uploaded files
│   ├── .env                  # Environment variables
│   ├── .gitignore            # Git ignore file
│   ├── package.json          # NPM package file
│   └── src/                 # Source files
└── README.md
```
