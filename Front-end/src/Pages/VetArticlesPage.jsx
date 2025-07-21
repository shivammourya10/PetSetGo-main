import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaNewspaper, FaExternalLinkAlt, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import ArticleService from '../services/ArticleService';

const VetArticlesPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedArticles, setSavedArticles] = useState([]);

  // List of article categories
  const categories = ['Dogs', 'Cats', 'Birds', 'Reptiles', 'Small Pets', 'Nutrition', 'Training', 'Health'];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // In a real app:
        // const response = await ArticleService.getArticles();
        // setArticles(response.data);
        
        // Use dummy data for now
        setTimeout(() => {
          const dummyArticles = [
            {
              id: 1,
              title: 'Understanding Canine Vaccinations: A Complete Guide',
              summary: 'Learn about core and non-core vaccines for dogs, vaccination schedules, and potential side effects.',
              imageUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              source: 'PetMD',
              author: 'Dr. Sarah Johnson',
              publishDate: '2025-07-12T08:30:00Z',
              url: 'https://www.petmd.com',
              category: 'Dogs'
            },
            {
              id: 2,
              title: 'Common Cat Behavior Problems and Solutions',
              summary: 'Addressing issues like scratching furniture, litter box avoidance, and aggression with practical solutions.',
              imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              source: 'VetStreet',
              author: 'Dr. Michael Williams',
              publishDate: '2025-07-10T14:45:00Z',
              url: 'https://www.vetstreet.com',
              category: 'Cats'
            },
            {
              id: 3,
              title: 'Nutrition Guide for Senior Dogs',
              summary: 'How dietary needs change as dogs age and recommendations for maintaining optimal health in senior dogs.',
              imageUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              source: 'American Veterinary Medical Association',
              author: 'Dr. Robert Anderson',
              publishDate: '2025-07-05T09:15:00Z',
              url: 'https://www.avma.org',
              category: 'Nutrition'
            },
            {
              id: 4,
              title: 'Exotic Pet Care: Bearded Dragon Basics',
              summary: 'Essential information for new bearded dragon owners, including habitat setup, diet, and common health concerns.',
              imageUrl: 'https://images.unsplash.com/photo-1597245621709-2da3218124d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              source: 'Reptiles Magazine',
              author: 'Dr. Emily Chen',
              publishDate: '2025-07-03T11:20:00Z',
              url: 'https://www.reptilesmagazine.com',
              category: 'Reptiles'
            },
            {
              id: 5,
              title: 'Positive Reinforcement Training Techniques for Puppies',
              summary: 'Effective reward-based methods to train puppies and build a strong bond with your new pet.',
              imageUrl: 'https://images.unsplash.com/photo-1593134257782-e89567b7718a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              source: 'Animal Behavior College',
              author: 'Dr. James Wilson',
              publishDate: '2025-06-28T13:10:00Z',
              url: 'https://www.animalbehaviorcollege.com',
              category: 'Training'
            },
            {
              id: 6,
              title: 'Avian Health: Signs Your Bird May Be Sick',
              summary: 'Learn to recognize early warning signs of illness in pet birds and when to seek veterinary care.',
              imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              source: 'Association of Avian Veterinarians',
              author: 'Dr. Lisa Peterson',
              publishDate: '2025-06-25T15:30:00Z',
              url: 'https://www.aav.org',
              category: 'Birds'
            },
          ];
          
          setArticles(dummyArticles);
          setLoading(false);
        }, 1500);
        
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load veterinary articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticles();
    
    // Load saved articles from localStorage
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
  }, []);

  // Filter articles based on search term and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle saving an article
  const toggleSaveArticle = (articleId) => {
    let updatedSaved;
    if (savedArticles.includes(articleId)) {
      updatedSaved = savedArticles.filter(id => id !== articleId);
    } else {
      updatedSaved = [...savedArticles, articleId];
    }
    setSavedArticles(updatedSaved);
    localStorage.setItem('savedArticles', JSON.stringify(updatedSaved));
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <Layout title="Veterinary Articles">
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-blue-500 px-4 py-3">
                <h3 className="text-white font-medium">Categories</h3>
              </div>
              <div className="p-4">
                {/* Search bar */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <ul className="space-y-1">
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
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">Reading List</h4>
                  <div className="text-sm text-gray-500">
                    {savedArticles.length === 0 ? (
                      <p>No saved articles yet</p>
                    ) : (
                      <p>{savedArticles.length} article(s) saved</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Articles */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-300">
                {error}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaNewspaper className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Articles Found</h3>
                <p className="text-gray-500">Try adjusting your search terms or selecting a different category.</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredArticles.map((article) => (
                  <motion.div key={article.id} variants={itemVariants}>
                    <Card hover={false}>
                      <CardBody className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 h-48 md:h-auto">
                            {article.imageUrl ? (
                              <img 
                                src={article.imageUrl} 
                                alt={article.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <FaNewspaper className="text-gray-400 text-4xl" />
                              </div>
                            )}
                          </div>
                          <div className="md:w-2/3 p-6">
                            <div className="flex justify-between items-start mb-2">
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {article.category}
                              </span>
                              <button 
                                onClick={() => toggleSaveArticle(article.id)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                aria-label={savedArticles.includes(article.id) ? "Unsave article" : "Save article"}
                              >
                                {savedArticles.includes(article.id) ? (
                                  <FaBookmark className="text-blue-500" />
                                ) : (
                                  <FaRegBookmark />
                                )}
                              </button>
                            </div>
                            
                            <h3 className="font-semibold text-xl text-gray-800 mb-3">
                              {article.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4">
                              {article.summary}
                            </p>
                            
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-500">
                                <div>{article.author}</div>
                                <div>{article.source} • {formatDate(article.publishDate)}</div>
                              </div>
                              
                              <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                              >
                                Read More
                                <FaExternalLinkAlt className="ml-1 text-xs" />
                              </a>
                            </div>
                          </div>
                        </div>
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

export default VetArticlesPage;
