import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaEdit, FaSave, FaCamera, FaPaw, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaPencilAlt, FaTimes, FaCheck, FaHeart, FaCalendarAlt, FaAward, FaStar,
  FaShieldAlt, FaBell, FaCog, FaLock, FaEye, FaEyeSlash, FaUpload, FaTrash
} from 'react-icons/fa';
import { MdPets, MdForum, MdFavorite, MdNotifications, MdSecurity } from 'react-icons/md';
import Layout from '../components/Layout';
import Card, { CardBody, CardHeader } from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import FileUpload from '../components/FileUpload';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/AuthService';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNo: user?.phoneNo || '',
    userName: user?.userName || '',
    bio: user?.bio || "I'm a passionate pet lover who enjoys taking care of furry friends!",
    location: user?.location || '',
    dateOfBirth: user?.dateOfBirth || '',
    interests: user?.interests || ['Dogs', 'Cats'],
    experience: user?.experience || 'Beginner',
    preferences: {
      emailNotifications: user?.preferences?.emailNotifications || true,
      smsNotifications: user?.preferences?.smsNotifications || false,
      marketingEmails: user?.preferences?.marketingEmails || false,
      publicProfile: user?.preferences?.publicProfile || true,
      showLocation: user?.preferences?.showLocation || false,
      showContactInfo: user?.preferences?.showContactInfo || false,
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [stats] = useState({
    petsOwned: 4,
    breedingRequests: 12,
    forumPosts: 28,
    yearsExperience: 3,
    helpfulVotes: 156,
    communityRank: 'Expert'
  });

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'preferences', label: 'Preferences', icon: <FaCog /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'activity', label: 'Activity', icon: <FaCalendarAlt /> }
  ];

  const interestOptions = ['Dogs', 'Cats', 'Birds', 'Fish', 'Reptiles', 'Small Mammals', 'Exotic Pets'];
  const experienceOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleFileSelect = (file) => {
    setProfilePicture(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phoneNo: user?.phoneNo || '',
      userName: user?.userName || '',
      bio: user?.bio || '',
      location: user?.location || '',
      dateOfBirth: user?.dateOfBirth || '',
      interests: user?.interests || ['Dogs', 'Cats'],
      experience: user?.experience || 'Beginner',
      preferences: {
        emailNotifications: user?.preferences?.emailNotifications || true,
        smsNotifications: user?.preferences?.smsNotifications || false,
        marketingEmails: user?.preferences?.marketingEmails || false,
        publicProfile: user?.preferences?.publicProfile || true,
        showLocation: user?.preferences?.showLocation || false,
        showContactInfo: user?.preferences?.showContactInfo || false,
      }
    });
    setIsEditing(false);
    setProfilePicture(null);
    setPreviewUrl(null);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            {!isEditing && (
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                icon={<FaEdit />}
                size="sm"
              >
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              icon={<FaUser />}
            />
            <InputField
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              disabled={!isEditing}
              icon={<FaPencilAlt />}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              icon={<FaEnvelope />}
            />
            <InputField
              label="Phone Number"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleInputChange}
              disabled={!isEditing}
              icon={<FaPhone />}
            />
            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={!isEditing}
              icon={<FaMapMarkerAlt />}
            />
            <InputField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={!isEditing}
              icon={<FaCalendarAlt />}
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Tell us about yourself and your experience with pets..."
            />
          </div>

          {/* Experience Level */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
            <div className="flex flex-wrap gap-2">
              {experienceOptions.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => isEditing && setFormData(prev => ({ ...prev, experience: level }))}
                  disabled={!isEditing}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.experience === level
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${!isEditing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => isEditing && handleInterestToggle(interest)}
                  disabled={!isEditing}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${!isEditing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <Button
                variant="primary"
                onClick={handleSave}
                icon={<FaSave />}
                loading={loading}
              >
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                icon={<FaTimes />}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Notification Preferences</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Email Notifications</label>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="preferences.emailNotifications"
                  checked={formData.preferences.emailNotifications}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">SMS Notifications</label>
                <p className="text-sm text-gray-500">Receive updates via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="preferences.smsNotifications"
                  checked={formData.preferences.smsNotifications}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Marketing Emails</label>
                <p className="text-sm text-gray-500">Receive promotional content</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="preferences.marketingEmails"
                  checked={formData.preferences.marketingEmails}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Privacy Settings</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Public Profile</label>
                <p className="text-sm text-gray-500">Make your profile visible to other users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="preferences.publicProfile"
                  checked={formData.preferences.publicProfile}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Show Location</label>
                <p className="text-sm text-gray-500">Display your location on your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="preferences.showLocation"
                  checked={formData.preferences.showLocation}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Show Contact Info</label>
                <p className="text-sm text-gray-500">Display contact information publicly</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="preferences.showContactInfo"
                  checked={formData.preferences.showContactInfo}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Password Settings</h3>
        </CardHeader>
        <CardBody>
          {!showPasswordChange ? (
            <div className="text-center py-6">
              <FaLock className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Keep your account secure with a strong password</p>
              <Button
                variant="primary"
                onClick={() => setShowPasswordChange(true)}
                icon={<FaEdit />}
              >
                Change Password
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <InputField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                icon={<FaLock />}
              />
              <InputField
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                icon={<FaLock />}
              />
              <InputField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                icon={<FaLock />}
              />
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="primary"
                  onClick={handlePasswordUpdate}
                  icon={<FaCheck />}
                  loading={loading}
                >
                  Update Password
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  icon={<FaTimes />}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Account Security</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <FaShieldAlt className="text-green-500 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Two-Factor Authentication</p>
                  <p className="text-sm text-green-600">Extra security for your account</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <FaEye className="text-blue-500 mr-3" />
                <div>
                  <p className="font-medium text-blue-800">Login Activity</p>
                  <p className="text-sm text-blue-600">View recent login attempts</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                View
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Activity Summary</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MdPets className="text-3xl text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.petsOwned}</div>
              <div className="text-sm text-blue-700">Pets Owned</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FaHeart className="text-3xl text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.breedingRequests}</div>
              <div className="text-sm text-purple-700">Breeding Requests</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MdForum className="text-3xl text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.forumPosts}</div>
              <div className="text-sm text-green-700">Forum Posts</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <FaCalendarAlt className="text-3xl text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{stats.yearsExperience}</div>
              <div className="text-sm text-yellow-700">Years Experience</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <FaStar className="text-3xl text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{stats.helpfulVotes}</div>
              <div className="text-sm text-red-700">Helpful Votes</div>
            </div>
            
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <FaAward className="text-3xl text-indigo-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-indigo-600">{stats.communityRank}</div>
              <div className="text-sm text-indigo-700">Community Rank</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-4 max-w-6xl"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants} className="mb-4">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </motion.div>
        )}

        {success && (
          <motion.div variants={itemVariants} className="mb-4">
            <Alert type="success" message={success} onClose={() => setSuccess(null)} />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Overview Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardBody className="text-center">
                <div className="relative inline-block mb-4">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mx-auto overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    {previewUrl || user?.profilePicture ? (
                      <img 
                        src={previewUrl || user?.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser />
                    )}
                  </motion.div>
                  
                  {isEditing && (
                    <button
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                      className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors"
                    >
                      <FaCamera className="text-xs" />
                    </button>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-800">{formData.name}</h3>
                <p className="text-gray-600">@{formData.userName}</p>
                
                <div className="flex items-center justify-center mt-2 text-gray-500">
                  <FaPaw className="mr-1" />
                  <span className="text-sm">{formData.experience} Pet Lover</span>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-sm text-gray-600">Community Rank</div>
                  <div className="text-lg font-bold text-purple-600 flex items-center justify-center">
                    <FaAward className="mr-1" />
                    {stats.communityRank}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-4">
                    <input
                      type="file"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'preferences' && renderPreferencesTab()}
                {activeTab === 'security' && renderSecurityTab()}
                {activeTab === 'activity' && renderActivityTab()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ProfilePage;
