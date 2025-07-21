import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute';
import App from './App.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import RegisterPage from './Pages/RegisterPage.jsx';
import LandingPage from './Pages/LandingPage.jsx';
import HomePage from './Pages/HomePage.jsx';
import PetsPage from './Pages/PetsPage.jsx';
import PetDetailPage from './Pages/PetDetailPage.jsx';
import AddPetPage from './Pages/AddPetPage.jsx';
import EditPetPage from './Pages/EditPetPage.jsx';
import BreedingPage from './Pages/BreedingPage.jsx';
import ForumPage from './Pages/ForumPage.jsx';
import TopicDetailPage from './Pages/TopicDetailPage.jsx';
import CreateTopicPage from './Pages/CreateTopicPage.jsx';
import MedicalRecordsPage from './Pages/MedicalRecordsPage.jsx';
import AddMedicalRecordPage from './Pages/AddMedicalRecordPage.jsx';
import VetArticlesPage from './Pages/VetArticlesPage.jsx';
import ArticleDetailPage from './Pages/ArticleDetailPage.jsx';
import AdoptionPage from './Pages/AdoptionPage.jsx';
import AdoptionRequestPage from './Pages/AdoptionRequestPage.jsx';
import ListPetPage from './Pages/ListPetPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import NotFoundPage from './Pages/NotFoundPage.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Routes>
          <Route path="/" element={<App />} />
          <Route path="/user/login" element={<LoginPage />} />
          <Route path="/user/register" element={<RegisterPage />} />
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Protected routes */}
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/pets" element={<PrivateRoute><PetsPage /></PrivateRoute>} />
          <Route path="/pets/:petId" element={<PrivateRoute><PetDetailPage /></PrivateRoute>} />
          <Route path="/pets/:petId/edit" element={<PrivateRoute><EditPetPage /></PrivateRoute>} />
          <Route path="/pets/add" element={<PrivateRoute><AddPetPage /></PrivateRoute>} />
          <Route path="/breeding" element={<PrivateRoute><BreedingPage /></PrivateRoute>} />
          <Route path="/forum" element={<PrivateRoute><ForumPage /></PrivateRoute>} />
          <Route path="/forum/topics/:topicId" element={<PrivateRoute><TopicDetailPage /></PrivateRoute>} />
          <Route path="/forum/create" element={<PrivateRoute><CreateTopicPage /></PrivateRoute>} />
          <Route path="/medical" element={<PrivateRoute><MedicalRecordsPage /></PrivateRoute>} />
          <Route path="/medical/add" element={<PrivateRoute><AddMedicalRecordPage /></PrivateRoute>} />
          <Route path="/articles" element={<PrivateRoute><VetArticlesPage /></PrivateRoute>} />
          <Route path="/articles/:articleId" element={<PrivateRoute><ArticleDetailPage /></PrivateRoute>} />
          <Route path="/adoption" element={<PrivateRoute><AdoptionPage /></PrivateRoute>} />
          <Route path="/adoption/request/:petId" element={<PrivateRoute><AdoptionRequestPage /></PrivateRoute>} />
          <Route path="/adoption/list" element={<PrivateRoute><ListPetPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  </BrowserRouter>
);
