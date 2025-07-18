import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className, onClick, hover = true }) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      whileHover={hover ? { y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className }) => {
  return (
    <div className={`px-6 py-4 border-b ${className}`}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className }) => {
  return (
    <div className={`px-6 py-4 bg-gray-50 border-t ${className}`}>
      {children}
    </div>
  );
};

export default Card;
