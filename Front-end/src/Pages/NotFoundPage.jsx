import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaPaw } from 'react-icons/fa';
import Button from '../components/Button';

const NotFoundPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-lg w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <FaPaw className="text-blue-600 text-9xl mx-auto" />
        </motion.div>
        
        <motion.h1 
          className="text-6xl font-bold text-gray-800 mb-4"
          variants={itemVariants}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="text-2xl font-semibold text-gray-700 mb-6"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mb-8"
          variants={itemVariants}
        >
          Oops! It seems the page you're looking for has gone for a walk.
          <br />
          Let's get you back on track!
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          variants={itemVariants}
        >
          <Link to="/">
            <Button variant="primary" icon={<FaHome />}>
              Go Home
            </Button>
          </Link>
          
          <Link to="/pets">
            <Button variant="outline" icon={<FaPaw />}>
              View My Pets
            </Button>
          </Link>
        </motion.div>
        
        <motion.div 
          className="mt-12"
          variants={itemVariants}
          animate={{ 
            y: [0, -10, 0],
            transition: {
              repeat: Infinity,
              duration: 2
            }
          }}
        >
          <img 
            src="https://i.ibb.co/P5G8gB0/lost-dog.png" 
            alt="Lost dog" 
            className="h-40 mx-auto opacity-80"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
