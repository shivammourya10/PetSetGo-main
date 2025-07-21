import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBookmark, FaRegBookmark, FaShare, FaExternalLinkAlt, FaClock, FaUser, FaTag, FaPrint, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import ArticleService from '../services/ArticleService';

const ArticleDetailPage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      
      // Since we don't have individual article endpoints, we'll simulate the data
      const dummyArticle = {
        id: articleId,
        title: 'Complete Guide to Pet Nutrition: What Every Pet Owner Should Know',
        content: `
          <div class="prose max-w-none">
            <p>Proper nutrition is the foundation of your pet's health and wellbeing. Understanding what to feed your furry friend can seem overwhelming with so many options available, but this comprehensive guide will help you make informed decisions.</p>
            
            <h2>Understanding Your Pet's Nutritional Needs</h2>
            <p>Different pets have vastly different nutritional requirements. Dogs are omnivores and can thrive on a varied diet, while cats are obligate carnivores requiring specific nutrients found only in animal tissue.</p>
            
            <h3>Essential Nutrients</h3>
            <ul>
              <li><strong>Proteins:</strong> Building blocks for muscles, organs, and immune system</li>
              <li><strong>Fats:</strong> Energy source and essential for healthy skin and coat</li>
              <li><strong>Carbohydrates:</strong> Quick energy and fiber for digestive health</li>
              <li><strong>Vitamins:</strong> Support various bodily functions</li>
              <li><strong>Minerals:</strong> Important for bone health and metabolic processes</li>
              <li><strong>Water:</strong> The most crucial nutrient for all life processes</li>
            </ul>
            
            <h2>Life Stage Feeding</h2>
            <p>Your pet's nutritional needs change throughout their life:</p>
            
            <h3>Puppy/Kitten (0-12 months)</h3>
            <p>Young animals need higher calorie, protein, and fat content to support rapid growth and development. Feed specially formulated puppy or kitten food during this crucial period.</p>
            
            <h3>Adult (1-7 years)</h3>
            <p>Adult pets need balanced nutrition to maintain their health and energy levels. Choose high-quality adult formulas appropriate for your pet's size and activity level.</p>
            
            <h3>Senior (7+ years)</h3>
            <p>Older pets may need foods with modified protein levels, added joint support, and enhanced digestibility to accommodate changing metabolism and health needs.</p>
            
            <h2>Reading Pet Food Labels</h2>
            <p>Understanding pet food labels is crucial for making informed choices:</p>
            <ul>
              <li>Look for named protein sources as the first ingredient</li>
              <li>Avoid foods with excessive fillers or by-products</li>
              <li>Check for AAFCO (Association of American Feed Control Officials) statement</li>
              <li>Consider your pet's specific needs and any allergies</li>
            </ul>
            
            <h2>Common Feeding Mistakes to Avoid</h2>
            <ol>
              <li><strong>Overfeeding:</strong> Obesity is a growing problem in pets</li>
              <li><strong>Table scraps:</strong> Human food can be harmful or toxic to pets</li>
              <li><strong>Inconsistent feeding:</strong> Sudden diet changes can cause digestive upset</li>
              <li><strong>Ignoring portion sizes:</strong> Follow feeding guidelines on pet food packages</li>
              <li><strong>Not providing fresh water:</strong> Always ensure clean water is available</li>
            </ol>
            
            <h2>Special Dietary Considerations</h2>
            <p>Some pets may require special diets due to:</p>
            <ul>
              <li>Food allergies or sensitivities</li>
              <li>Medical conditions (diabetes, kidney disease, etc.)</li>
              <li>Weight management needs</li>
              <li>Digestive issues</li>
            </ul>
            
            <p>Always consult with your veterinarian before making significant changes to your pet's diet, especially if they have health concerns.</p>
            
            <h2>Treats and Supplements</h2>
            <p>While treats can be a great training tool and way to bond with your pet, they should comprise no more than 10% of your pet's daily caloric intake. Choose healthy, high-quality treats and avoid those with artificial colors, preservatives, or excessive sugar.</p>
            
            <p>Supplements should only be given under veterinary guidance, as most high-quality commercial pet foods are nutritionally complete.</p>
            
            <h2>Conclusion</h2>
            <p>Providing proper nutrition is one of the most important things you can do for your pet's health and longevity. When in doubt, consult with your veterinarian or a veterinary nutritionist to ensure you're meeting your pet's specific needs.</p>
          </div>
        `,
        author: 'Dr. Sarah Johnson, DVM',
        publishedAt: '2024-01-15T10:00:00Z',
        readTime: '8 min read',
        category: 'Nutrition',
        tags: ['nutrition', 'health', 'feeding', 'diet'],
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        url: 'https://example.com/article',
        summary: 'Learn everything you need to know about feeding your pet properly, from basic nutritional needs to special dietary considerations.',
        source: 'PetCare Today'
      };
      
      setArticle(dummyArticle);
      
      // Set related articles (dummy data)
      setRelatedArticles([
        {
          id: '2',
          title: 'Exercise Requirements for Different Dog Breeds',
          summary: 'Understanding how much exercise your dog needs based on their breed and age.',
          image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          readTime: '5 min read',
          category: 'Exercise'
        },
        {
          id: '3',
          title: 'Common Signs of Illness in Cats',
          summary: 'Learn to recognize early warning signs that your cat may need veterinary attention.',
          image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          readTime: '6 min read',
          category: 'Health'
        },
        {
          id: '4',
          title: 'Creating a Safe Environment for Your New Puppy',
          summary: 'Essential tips for puppy-proofing your home and creating a safe space.',
          image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          readTime: '7 min read',
          category: 'Training'
        }
      ]);
      
    } catch (err) {
      setError('Failed to load article. Please try again.');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save/remove the bookmark via API
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-4xl text-purple-600"
          >
            <FaUser />
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert type="error" message={error} />
        <div className="mt-4">
          <Button onClick={() => navigate('/articles')}>
            <FaArrowLeft className="mr-2" /> Back to Articles
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-4 max-w-4xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/articles')}
            className="mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back to Articles
          </Button>
        </motion.div>

        {/* Article Content */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardBody className="p-8">
              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaUser className="mr-1" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center">
                  <FaTag className="mr-1" />
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>

              {/* Article Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {article.title}
              </h1>

              {/* Article Summary */}
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {article.summary}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b">
                <Button
                  variant="outline"
                  onClick={handleBookmark}
                  icon={isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                >
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
                
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    icon={<FaShare />}
                  >
                    Share
                  </Button>
                  
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 p-2 min-w-[200px]"
                    >
                      <button
                        onClick={() => handleShare('facebook')}
                        className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 rounded"
                      >
                        <FaFacebook className="mr-2 text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 rounded"
                      >
                        <FaTwitter className="mr-2 text-blue-400" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 rounded"
                      >
                        <FaLinkedin className="mr-2 text-blue-700" />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 rounded"
                      >
                        <FaShare className="mr-2 text-gray-600" />
                        Copy Link
                      </button>
                    </motion.div>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  icon={<FaPrint />}
                >
                  Print
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open(article.url, '_blank')}
                  icon={<FaExternalLinkAlt />}
                >
                  Original Source
                </Button>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                      onClick={() => navigate(`/articles?tag=${tag}`)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Related Articles */}
        <motion.div variants={itemVariants} className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <motion.div
                key={relatedArticle.id}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => navigate(`/articles/${relatedArticle.id}`)}
              >
                <Card>
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardBody>
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {relatedArticle.category}
                      </span>
                      <span>{relatedArticle.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {relatedArticle.summary}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default ArticleDetailPage;
