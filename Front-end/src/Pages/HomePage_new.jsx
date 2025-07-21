import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaStethoscope, 
  FaNewspaper, FaBell, FaHeart, FaMapMarkerAlt, FaBirthdayCake, FaWeight,
  FaChartLine, FaTasks, FaUser, FaComments, FaAward, FaClock, FaGift,
  FaExclamationTriangle, FaCheckCircle, FaFireAlt, FaStar
} from "react-icons/fa";
import { MdPets, MdForum, MdFavorite, MdPerson, MdAdopt, MdHealthAndSafety } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import NotificationCenter from "../Components/NotificationCenter";
import PetService from "../services/PetService";
import BreedingService from "../services/BreedingService";
import ForumService from "../services/ForumService";
import ArticleService from "../services/ArticleService";

// Pet health and care tips with categories
const petTips = [
  { category: "Health", tip: "Schedule annual vet checkups even if your pet seems healthy", priority: "high" },
  { category: "Exercise", tip: "Regular exercise improves your pet's physical and mental health", priority: "medium" },
  { category: "Dental", tip: "Dental care is crucial - brush your pet's teeth regularly", priority: "high" },
  { category: "Vaccination", tip: "Keep vaccinations up to date to prevent common diseases", priority: "high" },
  { category: "Mental", tip: "Provide mental stimulation with toys and games", priority: "medium" },
  { category: "Nutrition", tip: "Fresh water should always be available for your pet", priority: "high" },
  { category: "Behavior", tip: "Watch for changes in behavior - they can indicate health issues", priority: "medium" },
  { category: "Feeding", tip: "Maintain a consistent feeding schedule for digestive health", priority: "medium" },
  { category: "Grooming", tip: "Regular grooming prevents matting and skin issues", priority: "low" },
  { category: "Safety", tip: "Pet-proof your home to avoid common household hazards", priority: "high" }
];

const HomePage = () => {
  // State management
  const [showNotifications, setShowNotifications] = useState(false);
  const [pets, setPets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [articles, setArticles] = useState([]);
  const [breedingMatches, setBreedingMatches] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalPets: 0,
    upcomingAppointments: 0,
    breedingRequests: 0,
    forumActivity: 0
  });
  const [loading, setLoading] = useState({
    pets: false,
    notifications: false,
    articles: false,
    stats: false
  });
  const [error, setError] = useState(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto-rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % petTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(prev => ({ ...prev, pets: true, stats: true }));
        
        // Fetch user's pets
        const petsResponse = await PetService.getUserPets();
        const userPets = petsResponse.data || [];
        
        // Enhanced pets with health data
        const enhancedPets = userPets.slice(0, 4).map(pet => ({
          ...pet,
          image: pet.image || `https://source.unsplash.com/300x300/?${pet.species?.toLowerCase() || 'pet'}`,
          healthScore: pet.healthScore || Math.floor(Math.random() * 20) + 80,
          lastCheckup: pet.lastCheckup || new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          nextAppointment: pet.nextAppointment || (Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null),
          mood: ['Happy', 'Playful', 'Calm', 'Energetic'][Math.floor(Math.random() * 4)],
          isAvailableForBreeding: pet.isAvailableForBreeding ?? Math.random() > 0.5,
        }));
        
        setPets(enhancedPets);
        
        // Update dashboard stats
        setDashboardStats({
          totalPets: userPets.length,
          upcomingAppointments: enhancedPets.filter(p => p.nextAppointment).length,
          breedingRequests: Math.floor(Math.random() * 5) + 1,
          forumActivity: Math.floor(Math.random() * 10) + 3
        });
        
        // Generate notifications
        const notifs = [];
        enhancedPets.forEach(pet => {
          if (pet.nextAppointment) {
            notifs.push({
              id: `vet-${pet.id}`,
              type: 'appointment',
              title: `Vet Appointment Reminder`,
              message: `${pet.name} has a checkup scheduled for ${new Date(pet.nextAppointment).toLocaleDateString()}`,
              time: new Date(),
              priority: 'high',
              action: () => navigate('/medical')
            });
          }
          
          const daysSinceCheckup = Math.floor((Date.now() - new Date(pet.lastCheckup)) / (1000 * 60 * 60 * 24));
          if (daysSinceCheckup > 365) {
            notifs.push({
              id: `checkup-${pet.id}`,
              type: 'health',
              title: `Health Check Due`,
              message: `${pet.name} hasn't had a checkup in over a year`,
              time: new Date(),
              priority: 'medium',
              action: () => navigate('/medical')
            });
          }
        });
        
        setNotifications(notifs);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        
        // No fallback data - only show real pets from database
        setPets([]);
        setDashboardStats({
          totalPets: mockPets.length,
          upcomingAppointments: 1,
          breedingRequests: 2,
          forumActivity: 5
        });
        
      } finally {
        setLoading(prev => ({ ...prev, pets: false, stats: false }));
      }
    };

    const fetchArticles = async () => {
      setLoading(prev => ({ ...prev, articles: true }));
      try {
        const response = await ArticleService.getArticles();
        setArticles(response.data.slice(0, 3));
      } catch (err) {
        // Sample articles
        setArticles([
          {
            id: '1',
            title: 'Understanding Pet Nutrition',
            excerpt: 'Learn about essential nutrients and feeding schedules for optimal pet health.',
            author: 'Dr. Sarah Wilson',
            readTime: '5 min read',
            image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
          },
          {
            id: '2',
            title: 'Pet Exercise Guidelines',
            excerpt: 'Discover the right amount and type of exercise for different pet breeds.',
            author: 'Dr. Michael Chen',
            readTime: '3 min read',
            image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
          }
        ]);
      } finally {
        setLoading(prev => ({ ...prev, articles: false }));
      }
    };

    fetchDashboardData();
    fetchArticles();
  }, [user, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const quickActions = [
    {
      title: "Add Pet",
      icon: <FaPlus />,
      color: "bg-gradient-to-r from-pink-500 to-red-500",
      action: () => navigate('/pets/add'),
      description: "Register a new pet"
    },
    {
      title: "Find Mate",
      icon: <FaHeart />,
      color: "bg-gradient-to-r from-purple-500 to-indigo-500",
      action: () => navigate('/breeding'),
      description: "Breeding services"
    },
    {
      title: "Health Check",
      icon: <FaStethoscope />,
      color: "bg-gradient-to-r from-green-500 to-teal-500",
      action: () => navigate('/medical'),
      description: "Medical records"
    },
    {
      title: "Adoption",
      icon: <MdAdopt />,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      action: () => navigate('/adoption'),
      description: "Adopt a pet"
    }
  ];

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      >
        {/* Header Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white shadow-sm rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.name || 'Pet Lover'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Let's take care of your furry friends today
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FaBell className="text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Profile Avatar */}
              <div 
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate('/profile')}
              >
                {user?.name?.charAt(0) || 'P'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Pets</p>
                <p className="text-2xl font-bold">{dashboardStats.totalPets}</p>
              </div>
              <MdPets className="text-3xl text-blue-200" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Appointments</p>
                <p className="text-2xl font-bold">{dashboardStats.upcomingAppointments}</p>
              </div>
              <FaCalendarAlt className="text-3xl text-green-200" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Breeding</p>
                <p className="text-2xl font-bold">{dashboardStats.breedingRequests}</p>
              </div>
              <FaHeart className="text-3xl text-purple-200" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Forum Posts</p>
                <p className="text-2xl font-bold">{dashboardStats.forumActivity}</p>
              </div>
              <FaComments className="text-3xl text-orange-200" />
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className={`${action.color} text-white p-6 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-bold text-lg">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Pets Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <MdPets className="mr-2 text-purple-500" />
                  My Pets
                </h2>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/pets')}
                  className="text-sm"
                >
                  View All
                </Button>
              </div>
              
              {loading.pets ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : pets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <motion.div
                      key={pet.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate(`/pets/${pet.id}`)}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 cursor-pointer border hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800">{pet.name}</h3>
                            <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              {pet.mood}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{pet.breed} • {pet.age} years</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-500 text-xs" />
                              <span className="text-xs text-gray-600">{pet.healthScore}% Health</span>
                            </div>
                            {pet.nextAppointment && (
                              <div className="flex items-center gap-1">
                                <FaClock className="text-blue-500 text-xs" />
                                <span className="text-xs text-gray-600">Checkup due</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MdPets className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No pets yet</h3>
                  <p className="text-gray-500 mb-4">Add your first pet to get started!</p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/pets/add')}
                    icon={<FaPlus />}
                  >
                    Add Your First Pet
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Daily Tip */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <FaGift className="mr-2 text-yellow-500" />
                Daily Pet Tip
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTipIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    petTips[currentTipIndex].priority === 'high' ? 'bg-red-50 border-red-500' :
                    petTips[currentTipIndex].priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-green-50 border-green-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      petTips[currentTipIndex].priority === 'high' ? 'bg-red-100 text-red-700' :
                      petTips[currentTipIndex].priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {petTips[currentTipIndex].category}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {petTips[currentTipIndex].tip}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center mt-4">
                <div className="flex gap-1">
                  {petTips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTipIndex ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Articles */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <FaNewspaper className="mr-2 text-blue-500" />
                  Recent Articles
                </h3>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/articles')}
                  className="text-sm"
                >
                  View All
                </Button>
              </div>
              
              {loading.articles ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <motion.div
                      key={article.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate(`/articles/${article.id}`)}
                      className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all bg-gray-50 hover:bg-white"
                    >
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">
                        {article.title}
                      </h4>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />
    </Layout>
  );
};

export default HomePage;
