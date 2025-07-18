import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import { useAuth } from './context/AuthContext.jsx';

function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, redirect to home page
    // Otherwise, redirect to landing page
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/home');
      } else {
        navigate('/landing');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.img 
          src="/pet-logo.png" 
          alt="PetSetGo Logo"
          className="w-32 h-32 mx-auto mb-4"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        />
        <motion.h1 
          className="text-4xl font-bold text-blue-600 mb-2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          PetSetGo
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Your complete pet care solution
        </motion.p>
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full mx-auto animate-spin"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
