import express from 'express';
import listAllPet from "../controller/petMate/listAllPets.js"
import BreedingController from '../controller/petMate/BreedingController.js';
import matchController from '../controller/petMate/MatchController.js';
import getPendingRequest from "../controller/petMate/PendingReq.js"

const router = express.Router();

router.post('/:reqPetId/requestBreeding/:resPetId', BreedingController); // Define the route for breeding request
router.post('/:breedingStatusId/matchPets', matchController); // Define the route for matching pets
router.get('/:userId/pendingRequest', getPendingRequest); // Define the route for getting pending requests for a user
router.get('/:userId/getPetMates',listAllPet);

// Additional breeding management routes
router.put('/breeding-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // This would need proper implementation with BreedingRequest model
    return res.status(200).json({ 
      message: 'Breeding request updated successfully',
      data: { id, status }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/breeding-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // This would need proper implementation with BreedingRequest model
    return res.status(200).json({ 
      message: 'Breeding request deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;