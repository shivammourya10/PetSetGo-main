import express from 'express';
import petController from '../controller/petControllers/PetController.js';
import {upload} from "../middlewares/multer.middleware.js";
import RescueAdoption from '../controller/RescueAndAdoptionController.js';
import updateBreedingStatus from '../controller/petMate/updateBreedingStatusController.js';
import returnPets from '../controller/petControllers/ReturnPetsController.js';
import updatePet from '../controller/petControllers/updatePetController.js';
import {
  submitAdoptionRequest,
  getUserAdoptionRequests,
  getAdoptionRequest,
  updateAdoptionRequestStatus
} from '../controller/AdoptionController.js';
import verifyJwt from '../middlewares/verifyJwtMiddleware.js';


const router = express.Router();
router.post('/:userId/createPets',upload.single('file'),petController);
router.post('/rescueAndAdoption',upload.single('file'),RescueAdoption);
router.put('/:petId/updateBreedingStatus',updateBreedingStatus);
router.put('/:petId/updatePet',upload.single('file'),updatePet);
router.get('/:userId/returnPets', returnPets);

// Get all rescue and adoption pets
router.get('/rescueAndAdoption', async (req, res) => {
  try {
    const RescueAdoptionSchema = (await import('../models/RescueAndAdoption.js')).default;
    const adoptionPets = await RescueAdoptionSchema.find({});
    return res.status(200).json({ data: adoptionPets });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single adoption pet
router.get('/rescueAndAdoption/:petId', async (req, res) => {
  try {
    const { petId } = req.params;
    const RescueAdoptionSchema = (await import('../models/RescueAndAdoption.js')).default;
    const adoptionPet = await RescueAdoptionSchema.findById(petId);
    if (!adoptionPet) {
      return res.status(404).json({ message: 'Adoption pet not found' });
    }
    return res.status(200).json({ data: adoptionPet });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Adoption request routes (with JWT authentication)
router.post('/adoption/request/:petId', verifyJwt, submitAdoptionRequest);
router.get('/adoption/requests', verifyJwt, getUserAdoptionRequests);
router.get('/adoption/requests/:applicationId', verifyJwt, getAdoptionRequest);
router.put('/adoption/requests/:applicationId/status', verifyJwt, updateAdoptionRequestStatus);

// Add missing endpoints
router.get('/:petId', async (req, res) => {
  // Get single pet details
  try {
    const { petId } = req.params;
    const Pet = (await import('../models/pet/PetSchema.js')).default;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    return res.status(200).json({ data: pet });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:petId', async (req, res) => {
  // Delete pet
  try {
    const { petId } = req.params;
    const Pet = (await import('../models/pet/PetSchema.js')).default;
    const User = (await import('../models/User/UserSchema.js')).default;
    
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    // Remove pet from user's pets array
    await User.updateMany({}, { $pull: { Pets: petId } });
    
    // Delete the pet
    await Pet.findByIdAndDelete(petId);
    
    return res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;