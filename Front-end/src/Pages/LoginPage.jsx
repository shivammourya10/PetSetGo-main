import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaPaw } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Alert from "../components/Alert";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(location.state?.message || null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for URL parameters on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const messageParam = params.get('message');
    const redirectParam = params.get('redirect');
    
    if (messageParam) {
      setMessage(decodeURIComponent(messageParam));
    }
    
    // Store redirect path if present
    if (redirectParam) {
      location.state = { ...location.state, from: { pathname: decodeURIComponent(redirectParam) } };
    }
  }, [location.search]);
  
  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData);
      // Auth context will handle redirection
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <motion.div 
        className="bg-white p-8 rounded-lg shadow-lg w-96"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <FaPaw className="text-6xl text-blue-600" />
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-center text-gray-800 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Welcome Back!
        </motion.h2>
        
        <motion.p 
          className="text-center text-gray-600 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Please login to continue
        </motion.p>
        
        {(error || authError) && (
          <Alert 
            type="error" 
            message={error || authError} 
            onClose={() => setError(null)} 
          />
        )}
        
        {message && (
          <Alert 
            type="info" 
            message={message} 
            onClose={() => setMessage(null)} 
          />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField 
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            icon={<FaEnvelope className="text-gray-400" />}
          />
          
          <InputField 
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            icon={<FaLock className="text-gray-400" />}
          />
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/user/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;