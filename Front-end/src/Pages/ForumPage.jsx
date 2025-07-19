import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaComments, FaUser, FaClock, FaFilter } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card, { CardBody, CardHeader } from '../components/Card';
import Button from '../components/Button';
import ForumService from '../services/ForumService';
import { useAuth } from '../context/AuthContext';

const ForumPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // Get all topics or filter by category if selected
        const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
        const response = await ForumService.getTopics(filters);
        setTopics(response.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.map(topic => topic.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load forum topics. Please try again later.');
        
        // Fallback dummy data
        const dummyTopics = [
          {
            _id: '1',
            title: 'Tips for training a new puppy',
            content: 'I just got a new Labrador puppy. Any training tips?',
            category: 'Dogs',
            author: {
              _id: '101',
              name: 'John Doe'
            },
            createdAt: '2025-07-15T10:30:00Z',
            replyCount: 5
          },
          {
            _id: '2',
            title: 'Best food for cats with sensitive stomachs',
            content: 'My cat has been having digestive issues lately...',
            category: 'Cats',
            author: {
              _id: '102',
              name: 'Jane Smith'
            },
            createdAt: '2025-07-14T16:45:00Z',
            replyCount: 8
          },
          {
            _id: '3',
            title: 'Proper habitat setup for bearded dragons',
            content: 'I\'m thinking about getting a bearded dragon as a pet...',
            category: 'Reptiles',
            author: {
              _id: '103',
              name: 'Alex Johnson'
            },
            createdAt: '2025-07-13T09:15:00Z',
            replyCount: 3
          },
          {
            _id: '4',
            title: 'Dealing with dog anxiety during thunderstorms',
            content: 'My Golden Retriever gets really anxious during thunderstorms...',
            category: 'Dogs',
            author: {
              _id: '104',
              name: 'Sarah Williams'
            },
            createdAt: '2025-07-12T22:00:00Z',
            replyCount: 12
          },
          {
            _id: '5',
            title: 'Bird toy recommendations',
            content: 'Looking for toy recommendations for my parakeet...',
            category: 'Birds',
            author: {
              _id: '105',
              name: 'Michael Brown'
            },
            createdAt: '2025-07-11T14:20:00Z',
            replyCount: 6
          }
        ];
        
        setTopics(dummyTopics);
        setCategories([...new Set(dummyTopics.map(topic => topic.category))]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Filter topics based on search term and category
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Format date to relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Layout title="Community Forum">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-6">
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search topics"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Create topic button */}
          <Link to="/forum/create">
            <Button variant="primary" icon={<FaPlus />}>
              Create Topic
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-blue-500 px-4 py-3">
                <h3 className="text-white font-medium">Categories</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === 'all' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((category, index) => (
                    <li key={index}>
                      <button 
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Topics list */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : error && topics.length === 0 ? (
              <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-300">
                {error}
              </div>
            ) : filteredTopics.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaComments className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No topics found</h3>
                <p className="text-gray-500 mb-6">Be the first to start a discussion!</p>
                <Link to="/forum/create">
                  <Button variant="primary" icon={<FaPlus />}>
                    Create Topic
                  </Button>
                </Link>
              </div>
            ) : (
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredTopics.map((topic) => (
                  <motion.div 
                    key={topic.id} 
                    variants={itemVariants}
                  >
                    <Card hover>
                      <CardBody className="p-0">
                        <Link 
                          to={`/forum/topics/${topic.id}`}
                          className="block p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {topic.category}
                                </span>
                              </div>
                              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                {topic.title}
                              </h3>
                              <p className="text-gray-600 line-clamp-2 mb-3">
                                {topic.content}
                              </p>
                            </div>
                            <div className="bg-gray-100 rounded-md px-3 py-2 text-center min-w-[60px]">
                              <div className="text-lg font-semibold">{topic.replyCount}</div>
                              <div className="text-xs text-gray-500">replies</div>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaUser className="mr-1" />
                            <span className="mr-4">{topic.author.name}</span>
                            <FaClock className="mr-1" />
                            <span>{formatDate(topic.createdAt)}</span>
                          </div>
                        </Link>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForumPage;
