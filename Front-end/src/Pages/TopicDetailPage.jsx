import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUser, FaClock, FaEdit, FaTrash, FaReply } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Alert from '../components/Alert';
import ForumService from '../services/ForumService';
import { useAuth } from '../context/AuthContext.jsx';

const TopicDetailPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyError, setReplyError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchTopicAndReplies = async () => {
      try {
        // In a real application, we would make two API calls:
        // 1. ForumService.getTopic(topicId) to get topic details
        // 2. ForumService.getReplies(topicId) to get replies
        
        // For now, we'll use dummy data
        setTimeout(() => {
          const dummyTopic = {
            id: parseInt(topicId),
            title: 'Tips for training a new puppy',
            content: 'I just got a new Labrador puppy. He\'s 8 weeks old and full of energy! I\'ve never trained a dog before and would love some advice on where to start. What are the most important commands to teach first? And do you have any recommendations for treats that work well for training? Thanks in advance for your help!',
            category: 'Dogs',
            author: {
              id: 101,
              name: 'John Doe'
            },
            createdAt: '2025-07-15T10:30:00Z',
          };
          
          const dummyReplies = [
            {
              id: 201,
              topicId: parseInt(topicId),
              content: 'Congratulations on your new puppy! Start with basic commands like sit, stay, and come. Keep training sessions short (5-10 minutes) but frequent. Consistency is key!',
              author: {
                id: 102,
                name: 'Jane Smith'
              },
              createdAt: '2025-07-15T11:45:00Z',
            },
            {
              id: 202,
              topicId: parseInt(topicId),
              content: 'Small pieces of boiled chicken work great as training treats. Most puppies will do anything for them! Just make sure to account for these treats in their daily food intake so they don\'t gain too much weight.',
              author: {
                id: 103,
                name: 'Alex Johnson'
              },
              createdAt: '2025-07-15T12:30:00Z',
            },
            {
              id: 203,
              topicId: parseInt(topicId),
              content: 'Don\'t forget to socialize your puppy early! It\'s as important as command training. Try to introduce them to different people, environments, and other friendly dogs once they\'ve had all their vaccines.',
              author: {
                id: 104,
                name: 'Sarah Williams'
              },
              createdAt: '2025-07-15T14:15:00Z',
            }
          ];
          
          setTopic(dummyTopic);
          setReplies(dummyReplies);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching topic details:', err);
        setError('Failed to load topic. Please try again later.');
        setLoading(false);
      }
    };

    fetchTopicAndReplies();
  }, [topicId]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!newReply.trim()) {
      setReplyError('Reply cannot be empty');
      return;
    }
    
    setReplyLoading(true);
    setReplyError(null);
    
    try {
      // In a real application:
      // await ForumService.addReply({
      //   topicId,
      //   content: newReply,
      //   author: user.id
      // });
      
      // Simulate API call
      setTimeout(() => {
        const newReplyObj = {
          id: Date.now(), // temporary id
          topicId: parseInt(topicId),
          content: newReply,
          author: {
            id: user?.id || 999,
            name: user?.name || 'Current User'
          },
          createdAt: new Date().toISOString()
        };
        
        setReplies([...replies, newReplyObj]);
        setNewReply('');
        setSuccess('Reply added successfully!');
        setReplyLoading(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }, 1000);
      
    } catch (err) {
      console.error('Error adding reply:', err);
      setReplyError('Failed to add reply. Please try again.');
      setReplyLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-300 mb-6">
          {error}
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/forum')}>
              Back to Forum
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <Link to="/forum" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" />
            Back to Forum
          </Link>
        </div>

        {/* Topic Card */}
        <Card className="mb-8">
          <CardBody>
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                {topic.category}
              </span>
              <div className="text-sm text-gray-500">
                {formatDate(topic.createdAt)}
              </div>
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              {topic.title}
            </h1>
            
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <FaUser />
              </div>
              <div>
                <div className="font-medium">{topic.author.name}</div>
                <div className="text-xs text-gray-500">Topic Author</div>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{topic.content}</p>
            </div>
            
            {user?.id === topic.author.id && (
              <div className="mt-6 flex space-x-2">
                <Button variant="outline" size="sm" icon={<FaEdit />}>
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm" icon={<FaTrash />}>
                  Delete
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Replies Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Replies ({replies.length})
          </h2>
          
          {replies.length === 0 ? (
            <Card>
              <CardBody className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-3">💬</div>
                <p className="text-gray-600 mb-4">No replies yet. Be the first to respond!</p>
              </CardBody>
            </Card>
          ) : (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {replies.map((reply) => (
                <motion.div key={reply.id} variants={itemVariants}>
                  <Card>
                    <CardBody>
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                            <FaUser />
                          </div>
                          <div className="font-medium">{reply.author.name}</div>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaClock className="mr-1" />
                          {formatDate(reply.createdAt)}
                        </div>
                      </div>
                      
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-line">{reply.content}</p>
                      </div>
                      
                      {user?.id === reply.author.id && (
                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm" icon={<FaEdit />}>
                            Edit
                          </Button>
                          <Button variant="outline-danger" size="sm" icon={<FaTrash />}>
                            Delete
                          </Button>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Reply Form */}
        <Card className="mb-6">
          <CardBody>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add Your Reply
            </h2>
            
            {success && (
              <Alert type="success" message={success} onClose={() => setSuccess(null)} />
            )}
            
            {replyError && (
              <Alert type="error" message={replyError} onClose={() => setReplyError(null)} />
            )}
            
            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <textarea
                  placeholder="Write your reply here..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  rows={4}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <Button
                type="submit"
                variant="primary"
                disabled={replyLoading}
                icon={<FaReply />}
              >
                {replyLoading ? 'Posting...' : 'Post Reply'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default TopicDetailPage;
