import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaStethoscope, FaNewspaper, FaBell } from "react-icons/fa";
import { MdPets, MdForum, MdFavorite, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PetService from "../services/PetService";
import BreedingService from "../services/BreedingService";
import ForumService from "../services/ForumService";
import ArticleService from "../services/ArticleService";
import "react-multi-carousel/lib/styles.css";

// Pet health and care tips
const petTips = [
  "Regular exercise improves your pet's physical and mental health",
  "Schedule annual vet checkups even if your pet seems healthy",
  "Dental care is crucial - brush your pet's teeth regularly",
  "Keep vaccinations up to date to prevent common diseases",
  "Provide mental stimulation with toys and games",
  "Fresh water should always be available for your pet",
  "Watch for changes in behavior - they can indicate health issues",
  "Maintain a consistent feeding schedule for digestive health",
  "Regular grooming prevents matting and skin issues",
  "Pet-proof your home to avoid common household hazards"
];

const HomePage = () => {
  const [showTips, setShowTips] = useState(true);
  const [pets, setPets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState({
    pets: false,
    notifications: false,
    articles: false
  });
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user's pets
  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      setLoading(prev => ({ ...prev, pets: true }));
      try {
        const response = await PetService.getUserPets();
        setPets(response.data.slice(0, 3)); // Show only first 3 pets for dashboard
      } catch (err) {
        console.error("Error fetching pets:", err);
        // Use sample data for development if API fails
        setPets([
          { _id: "1", name: "Buddy", age: "2 years", breed: "Golden Retriever", petImage: "https://via.placeholder.com/100" },
          { _id: "2", name: "Luna", age: "3 years", breed: "Siamese Cat", petImage: "" }
        ]);
      } finally {
        setLoading(prev => ({ ...prev, pets: false }));
      }
    };

    // Fetch recent activity (breeding requests and forum replies)
    const fetchNotifications = async () => {
      if (!user) return;
      
      setLoading(prev => ({ ...prev, notifications: true }));
      try {
        // Get breeding requests
        const breedingResponse = await BreedingService.getBreedingRequests();
        
        // Collect notifications
        const notifs = [];
        
        // Format breeding requests as notifications
        if (breedingResponse.data && breedingResponse.data.length > 0) {
          breedingResponse.data.slice(0, 3).forEach(req => {
            notifs.push({
              id: req._id,
              type: 'breeding',
              message: `Breeding request for ${req.petName || 'your pet'}`,
              time: new Date(req.createdAt || Date.now()).toLocaleDateString(),
              read: false,
              link: `/breeding/requests`
            });
          });
        }
        
        setNotifications(notifs);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        // Sample data
        setNotifications([
          { 
            id: '1', 
            type: 'breeding', 
            message: 'New breeding request for Buddy', 
            time: new Date().toLocaleDateString(),
            read: false,
            link: '/breeding/requests'
          }
        ]);
      } finally {
        setLoading(prev => ({ ...prev, notifications: false }));
      }
    };

    // Fetch vet articles
    const fetchArticles = async () => {
      setLoading(prev => ({ ...prev, articles: true }));
      try {
        const response = await ArticleService.getArticles();
        setArticles(response.data.slice(0, 2)); // Show only first 2 articles
      } catch (err) {
        console.error("Error fetching articles:", err);
        // Sample data
        setArticles([
          {
            id: '1',
            title: 'Pet Vaccination Guide',
            snippet: 'Learn about essential vaccines for your pets...',
            source: 'PetCare Magazine'
          }
        ]);
      } finally {
        setLoading(prev => ({ ...prev, articles: false }));
      }
    };

    fetchPets();
    fetchNotifications();
    fetchArticles();
  }, [user]);

  const handleAddPet = () => {
    navigate('/pets/add');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 p-6 relative">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50 h-17">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Hello, {user?.name || 'Pet Lover'}!</h2>
          <span className="text-sm text-gray-600">Welcome to PetSetGo</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaBell size={20} className="text-gray-600 cursor-pointer" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {notifications.length}
              </span>
            )}
          </div>
          <div 
            className="w-10 h-10 flex items-center justify-center bg-pink-500 text-white font-bold rounded-full cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            {user?.name?.charAt(0) || 'P'}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-t-md p-3 flex justify-around items-center z-50">
        <button onClick={() => navigate('/home')} className="flex flex-col items-center text-pink-500">
          <MdPets size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => navigate('/pets')} className="flex flex-col items-center text-gray-600 hover:text-pink-500">
          <MdPets size={24} />
          <span className="text-xs">My Pets</span>
        </button>
        <button onClick={() => navigate('/breeding')} className="flex flex-col items-center text-gray-600 hover:text-pink-500">
          <MdFavorite size={24} />
          <span className="text-xs">Breeding</span>
        </button>
        <button onClick={() => navigate('/forum')} className="flex flex-col items-center text-gray-600 hover:text-pink-500">
          <MdForum size={24} />
          <span className="text-xs">Forum</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-gray-600 hover:text-pink-500">
          <MdPerson size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </div>

      {/* Tips Panel */}
      <motion.div
        className="fixed top-0 right-0 mt-20 w-72 bg-white shadow-lg p-4 z-40 flex flex-col rounded-l-xl max-h-[70vh] overflow-y-auto"
        initial={{ x: showTips ? 0 : 300 }}
        animate={{ x: showTips ? 0 : 300 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => setShowTips(!showTips)}
          className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-white rounded-l-md px-2 py-2 shadow-lg"
        >
          {showTips ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Pet Care Tips</h3>
        </div>
        <ul className="text-gray-700 text-sm space-y-3">
          {petTips.map((tip, index) => (
            <li key={index} className="border-b pb-2 flex items-start gap-2">
              <span className="text-pink-500 mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Main Content - Dashboard */}
      <div className="mt-20 mb-24 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div 
            className="bg-pink-500 text-white p-5 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg"
            whileHover={{ scale: 1.03 }}
            onClick={handleAddPet}
          >
            <FaPlus size={24} />
            <span className="text-lg font-semibold">Add a New Pet</span>
          </motion.div>
          
          <motion.div 
            className="bg-blue-500 text-white p-5 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg"
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/breeding/explore')}
          >
            <MdFavorite size={24} />
            <span className="text-lg font-semibold">Find a Mate</span>
          </motion.div>
          
          <motion.div 
            className="bg-purple-500 text-white p-5 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg"
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/forum')}
          >
            <MdForum size={24} />
            <span className="text-lg font-semibold">Visit Forums</span>
          </motion.div>
          
          <motion.div 
            className="bg-green-500 text-white p-5 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg"
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/adoption')}
          >
            <MdPets size={24} />
            <span className="text-lg font-semibold">Adoption Center</span>
          </motion.div>
        </div>
        
        {/* My Pets Overview */}
        <div className="bg-white p-5 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Pets</h2>
            <button 
              onClick={() => navigate('/pets')} 
              className="text-pink-500 hover:text-pink-600 text-sm"
            >
              View All →
            </button>
          </div>
          
          {loading.pets ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {pets && pets.length > 0 ? (
                pets.map((pet) => (
                  <motion.div
                    key={pet._id}
                    className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 w-full"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(`/pets/${pet._id}`)}
                  >
                    <img
                      src={pet.petImage || "https://via.placeholder.com/100"}
                      alt={pet.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-pink-300"
                    />
                    <div>
                      <h3 className="font-semibold">{pet.name}</h3>
                      <div className="text-xs text-gray-600">
                        <span>{pet.breed}</span> • <span>{pet.age}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center w-full p-4">
                  <p className="text-gray-500">You don't have any pets yet</p>
                  <button 
                    onClick={handleAddPet}
                    className="mt-2 text-sm text-blue-500 hover:underline"
                  >
                    Add your first pet
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Recent Activity/Notifications */}
        <div className="bg-white p-5 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          
          {loading.notifications ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications && notifications.length > 0 ? (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    className="p-3 border-l-4 border-blue-500 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    whileHover={{ x: 5 }}
                    onClick={() => navigate(notif.link)}
                  >
                    <div className="flex justify-between">
                      <p className={`font-medium ${notif.read ? 'text-gray-600' : 'text-gray-800'}`}>
                        {notif.message}
                      </p>
                      <span className="text-xs text-gray-500">{notif.time}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Vet Articles Preview */}
        <div className="bg-white p-5 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Vet Articles</h2>
            <button 
              onClick={() => navigate('/articles')} 
              className="text-pink-500 hover:text-pink-600 text-sm"
            >
              View All →
            </button>
          </div>
          
          {loading.articles ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {articles && articles.length > 0 ? (
                articles.map((article) => (
                  <motion.div
                    key={article.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(`/articles/${article.id}`)}
                  >
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{article.snippet}</p>
                    <p className="text-xs text-gray-500 mt-2">{article.source}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500">No articles available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
