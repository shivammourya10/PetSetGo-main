import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaPaw } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Alert from "../components/Alert";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userName: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate phone number
    if (formData.phoneNo.length < 10 || formData.phoneNo.length > 14) {
      setError("Phone number must be between 10 and 14 digits");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        userName: formData.userName,
        phoneNo: formData.phoneNo,
        password: formData.password,
      };
      
      console.log("Sending registration data:", { ...userData, password: "***" });
      
      const response = await register(userData);
      console.log("Registration response:", response.data);
      
      setSuccess(true);
      
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/user/login');
      }, 2000);
      
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response data:", err.response?.data);
      
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        // Handle specific field errors from the backend
        const errorMessages = err.response.data.errors.map(error => `${error.field || ''}: ${error.msg}`).join(", ");
        setError(errorMessages);
      } else if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else if (!err.response) {
        setError("Network error. Please check if the server is running.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="text-center">
          <motion.div 
            className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
          >
            <FaPaw className="h-8 w-8 text-blue-600" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-3xl font-extrabold text-gray-900"
          >
            Create an Account
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-gray-600"
          >
            Join PetSetGo and start your pet care journey
          </motion.p>
        </div>
        
        {error && (
          <Alert type="error" message={error} />
        )}
        
        {success && (
          <Alert type="success" message="Registration successful! Redirecting to login..." />
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <InputField 
            label="Full Name"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            icon={<FaUser className="text-gray-400" />}
          />
          
          <InputField 
            label="Email Address"
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
            label="Username"
            id="userName"
            name="userName"
            type="text"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Choose a username"
            required
            icon={<FaUser className="text-gray-400" />}
          />
          
          <InputField 
            label="Phone Number"
            id="phoneNo"
            name="phoneNo"
            type="tel"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder="Enter your phone number (10-14 digits)"
            required
            minLength="10"
            maxLength="14"
            pattern="[0-9]{10,14}"
            icon={<FaEnvelope className="text-gray-400" />}
          />
          
          <InputField 
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose a secure password"
            required
            icon={<FaLock className="text-gray-400" />}
          />
          
          <InputField 
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            icon={<FaLock className="text-gray-400" />}
          />
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/user/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
