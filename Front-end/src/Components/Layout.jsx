import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

const Layout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.main
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        {title && (
          <div className="pb-5 border-b border-gray-200 mb-6">
            <motion.h1 
              className="text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h1>
          </div>
        )}
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
