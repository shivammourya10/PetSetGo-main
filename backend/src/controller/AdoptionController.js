import AdoptionRequest from '../models/AdoptionRequest.js';
import User from '../models/User/UserSchema.js';
import Pet from '../models/pet/PetSchema.js';
import RescueAndAdoption from '../models/RescueAndAdoption.js';

// Submit adoption request
export const submitAdoptionRequest = async (req, res) => {
  try {
    const { petId } = req.params;
    const {
      applicantName,
      applicantEmail,
      applicantPhone,
      message,
      experienceWithPets,
      livingArrangement,
      reasonForAdoption
    } = req.body;

    // Verify the pet exists
    const pet = await RescueAndAdoption.findById(petId) || await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Get user ID from token (assuming middleware sets req.user)
    const userId = req.user?.id || req.userId;

    // Create adoption request
    const adoptionRequest = new AdoptionRequest({
      petId,
      userId,
      applicantName,
      applicantEmail,
      applicantPhone,
      message,
      experienceWithPets,
      livingArrangement,
      reasonForAdoption
    });

    await adoptionRequest.save();

    return res.status(201).json({
      message: 'Adoption request submitted successfully',
      data: adoptionRequest
    });
  } catch (error) {
    console.error('Error submitting adoption request:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user's adoption requests
export const getUserAdoptionRequests = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    const requests = await AdoptionRequest.find({ userId })
      .populate('petId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: requests
    });
  } catch (error) {
    console.error('Error fetching user adoption requests:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Get specific adoption request
export const getAdoptionRequest = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const request = await AdoptionRequest.findById(applicationId)
      .populate('petId')
      .populate('userId')
      .populate('reviewedBy');

    if (!request) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    return res.status(200).json({
      data: request
    });
  } catch (error) {
    console.error('Error fetching adoption request:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Update adoption request status (for pet owners/admins)
export const updateAdoptionRequestStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, reviewComments } = req.body;

    const request = await AdoptionRequest.findByIdAndUpdate(
      applicationId,
      {
        status,
        reviewComments,
        reviewedAt: new Date(),
        reviewedBy: req.user?.id || req.userId
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    return res.status(200).json({
      message: 'Adoption request updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Error updating adoption request:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
