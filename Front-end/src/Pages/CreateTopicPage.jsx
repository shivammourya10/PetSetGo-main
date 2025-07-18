import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEdit, FaImage, FaPlus } from "react-icons/fa";
import Layout from "../components/Layout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Alert from "../components/Alert";
import FileUpload from "../components/FileUpload";
import ForumService from "../services/ForumService";

const CreateTopicPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([
    { _id: "1", name: "Pet Health" },
    { _id: "2", name: "Training Tips" },
    { _id: "3", name: "Nutrition" },
    { _id: "4", name: "Pet Behavior" },
    { _id: "5", name: "Adoption" },
  ]);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (file) => {
    setFormData({
      ...formData,
      image: file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError("Topic title is required");
      return;
    }
    
    if (!formData.content.trim()) {
      setError("Topic content is required");
      return;
    }
    
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const topicData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          topicData.append(key, formData[key]);
        }
      });
      
      await ForumService.createTopic(topicData);
      setSuccess("Topic created successfully!");
      
      // Redirect after short delay
      setTimeout(() => {
        navigate("/forum");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create topic. Please try again.");
      console.error("Error creating topic:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-4"
      >
        <motion.div variants={itemVariants} className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700 flex-grow">
            Create New Topic
          </h1>
        </motion.div>

        {error && <motion.div variants={itemVariants}><Alert type="error" message={error} /></motion.div>}
        {success && <motion.div variants={itemVariants}><Alert type="success" message={success} /></motion.div>}

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <InputField
                  label="Topic Title"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a descriptive title for your topic"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <label htmlFor="category" className="block text-gray-700 font-medium">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Image (Optional)
                  </label>
                  <FileUpload 
                    onFileChange={handleFileChange}
                    accept="image/*"
                    placeholderIcon={<FaImage className="text-4xl" />}
                    placeholderText="Add an image to your topic (optional)"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <label htmlFor="content" className="block text-gray-700 font-medium">
                    Topic Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Write your topic content here..."
                    required
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex justify-end space-x-4"
            >
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/forum")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <FaEdit />
                    </motion.div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Create Topic
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default CreateTopicPage;
