import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaSearch, FaPaw, FaFileMedical, FaCalendarAlt, FaUpload, FaEye, FaImage, FaTimes } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import MedicalService from '../services/MedicalService';
import PetService from '../services/PetService';
import { useAuth } from '../context/AuthContext.jsx';

const MedicalRecordsPage = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  // Fetch user's pets on component mount
  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await PetService.getUserPets();
        console.log('Pets API Response:', response.data);
        
        // Map backend field names to frontend expected names
        const userPets = (response.data?.pets || []).map(pet => ({
          id: pet._id,
          _id: pet._id,
          name: pet.PetName || 'Unknown',
          species: pet.PetType || 'Unknown', 
          breed: pet.Breed || 'Unknown',
          age: pet.Age || 'Unknown',
          image: pet.PicUrl || `https://source.unsplash.com/400x400/?${(pet.PetType || 'pet').toLowerCase()}`,
          prescriptionCount: pet.Prescription ? pet.Prescription.length : 0
        }));
        
        setPets(userPets);
        
        // Auto-select first pet if available
        if (userPets.length > 0) {
          setSelectedPet(userPets[0]);
          await fetchMedicalRecords(userPets[0].id);
        }
        
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError('Failed to load your pets. Please try again later.');
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [user]);

  // Fetch medical records for selected pet
  const fetchMedicalRecords = async (petId) => {
    try {
      setLoading(true);
      const response = await MedicalService.getMedicalRecords(petId);
      console.log('Medical records response:', response.data);
      
      const records = response.data?.data || [];
      setMedicalRecords(records);
      
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records for this pet.');
      setMedicalRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle pet selection
  const handlePetSelection = async (pet) => {
    setSelectedPet(pet);
    setError(null);
    await fetchMedicalRecords(pet.id);
  };

  // Handle file selection for upload
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid file (JPEG, PNG, or PDF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  // Handle prescription upload
  const handleUploadPrescription = async () => {
    if (!selectedFile || !selectedPet) {
      setError('Please select a file and a pet');
      return;
    }

    try {
      setUploadLoading(true);
      setError(null);
      
      console.log('Uploading prescription for pet:', selectedPet.id);
      const response = await MedicalService.addMedicalRecord(selectedPet.id, selectedFile);
      
      console.log('Upload response:', response.data);
      setSuccess('Prescription uploaded successfully!');
      
      // Refresh medical records
      await fetchMedicalRecords(selectedPet.id);
      
      // Reset upload state
      setShowUploadModal(false);
      setSelectedFile(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Error uploading prescription:', err);
      setError(err.response?.data?.message || 'Failed to upload prescription. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  // Filter pets based on search term
  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout title="Medical Records">
      <div className="container mx-auto px-4 py-8">
        
        {/* Alert Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert 
                type="error" 
                message={error} 
                onClose={() => setError(null)} 
              />
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert 
                type="success" 
                message={success} 
                onClose={() => setSuccess(null)} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
            <p className="text-gray-600">Manage your pets&apos; medical history and prescriptions</p>
          </div>
          
          {selectedPet && (
            <Button
              onClick={() => setShowUploadModal(true)}
              icon={<FaUpload />}
              className="mt-4 md:mt-0"
            >
              Upload Prescription
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Pet Selection */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardBody>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaPaw className="mr-2 text-blue-500" />
                  Your Pets
                </h2>
                
                {/* Search */}
                <div className="relative mb-4">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Pets List */}
                {loading && pets.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading pets...</p>
                  </div>
                ) : filteredPets.length === 0 ? (
                  <div className="text-center py-8">
                    <FaPaw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No pets found</p>
                    <Link to="/pets/add">
                      <Button className="mt-4" size="sm">
                        Add Your First Pet
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPets.map((pet) => (
                      <motion.div
                        key={pet.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePetSelection(pet)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedPet?.id === pet.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                            <p className="text-sm text-gray-600">{pet.species} • {pet.breed}</p>
                            <p className="text-xs text-gray-500">
                              {pet.prescriptionCount} prescription{pet.prescriptionCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right Content - Medical Records */}
          <div className="lg:col-span-2">
            {selectedPet ? (
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center">
                      <FaFileMedical className="mr-2 text-green-500" />
                      Medical Records for {selectedPet.name}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {medicalRecords.length} record{medicalRecords.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading medical records...</p>
                    </div>
                  ) : medicalRecords.length === 0 ? (
                    <div className="text-center py-12">
                      <FaFileMedical className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical Records</h3>
                      <p className="text-gray-600 mb-6">
                        No medical records found for {selectedPet.name}. Upload the first prescription to get started.
                      </p>
                      <Button
                        onClick={() => setShowUploadModal(true)}
                        icon={<FaUpload />}
                      >
                        Upload First Prescription
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {medicalRecords.map((record, index) => (
                        <motion.div
                          key={record._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <FaCalendarAlt className="text-blue-500" />
                                <span className="font-semibold text-gray-900">
                                  {formatDate(record.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                Medical prescription uploaded for {selectedPet.name}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => window.open(record.PicUrl, '_blank')}
                                icon={<FaEye />}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                          
                          {record.PicUrl && (
                            <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={record.PicUrl}
                                alt="Medical prescription"
                                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(record.PicUrl, '_blank')}
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            ) : (
              <Card>
                <CardBody>
                  <div className="text-center py-12">
                    <FaPaw className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Pet</h3>
                    <p className="text-gray-600">
                      Choose a pet from the sidebar to view their medical records
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Upload Prescription</h3>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedFile(null);
                      setError(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Upload prescription for <strong>{selectedPet?.name}</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: JPEG, PNG, PDF (max 5MB)
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block">
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <FaImage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      {selectedFile ? (
                        <div>
                          <p className="text-sm font-medium text-green-600">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-600">Click to select file</p>
                          <p className="text-xs text-gray-500">or drag and drop</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedFile(null);
                      setError(null);
                    }}
                    className="flex-1"
                    disabled={uploadLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUploadPrescription}
                    className="flex-1"
                    disabled={!selectedFile || uploadLoading}
                    icon={uploadLoading ? null : <FaUpload />}
                  >
                    {uploadLoading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default MedicalRecordsPage;
