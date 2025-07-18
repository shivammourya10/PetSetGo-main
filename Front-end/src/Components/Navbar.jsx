import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { FaPaw, FaUser, FaSignOutAlt, FaNewspaper, FaComment, FaNotesMedical, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { name: 'Home', path: '/home', icon: <FaPaw /> },
    { name: 'My Pets', path: '/pets', icon: <FaPaw /> },
    { name: 'Adoption', path: '/adoption', icon: <FaHeart /> },
    { name: 'Breeding', path: '/breeding', icon: <FaHeart /> },
    { name: 'Forum', path: '/forum', icon: <FaComment /> },
    { name: 'Medical Records', path: '/medical', icon: <FaNotesMedical /> },
    { name: 'Articles', path: '/articles', icon: <FaNewspaper /> },
  ];

  return (
    <motion.nav 
      className="bg-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/home" className="flex-shrink-0 flex items-center">
              <motion.img
                className="h-8 w-auto"
                src="/pet-logo.png"
                alt="PetSetGo Logo"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="ml-2 text-xl font-bold text-blue-600"
                whileHover={{ scale: 1.05 }}
              >
                PetSetGo
              </motion.span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-blue-500 transition-colors duration-200"
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 relative group">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                  <FaUser />
                </span>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.name || 'User'}
                </span>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg top-full hidden group-hover:block z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center"
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
