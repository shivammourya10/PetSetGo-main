import zod from 'zod';
import Breeding from '../../models/petMate/BreedingSchema.js';
import matched from "../../models/petMate/matchedSchema.js";
import user from "../../models/User/UserSchema.js"
import { response } from 'express';

// Define Zod schemas for validation
const idSchema = zod.string();
const statusSchema = zod.enum(['Accept', 'Reject']);

const matchController = async (req, res) => {
    const { breedingStatusId } = req.params;
    const { status } = req.body;

    const statusValidation = statusSchema.safeParse(status); 
    const breedingIdValidation = idSchema.safeParse(breedingStatusId); 

    // Fixed: Proper error handling
    if (!statusValidation.success) {
        return res.status(400).json({
            message: "Invalid status",
            error: statusValidation.error
        });
    }

    if (!breedingIdValidation.success) {
        return res.status(400).json({
            message: "Invalid breeding status ID",
            error: breedingIdValidation.error
        });
    }

    try {
        const updatedBreedingStatus = await Breeding.findByIdAndUpdate(breedingStatusId, {
            status: status === 'Accept' ? 'approved' : 'rejected', // Fixed: Map to schema enum
        }, { new: true });

        if (!updatedBreedingStatus) {
            return res.status(404).json({ message: "Breeding status not found" });
        }
        
        // Only create match if status is 'Accept'
        if (status === 'Accept') {
            const { requesterPet, requestedPet } = updatedBreedingStatus;
            
            const user1 = await user.findOne({ Pets: requesterPet });
            const user2 = await user.findOne({ Pets: requestedPet });

            if (!user1 || !user2) {
                return res.status(404).json({ message: "Users not found" });
            }
                
            const updateMatched = new matched({
                pet1: updatedBreedingStatus.requesterPet,
                pet2: updatedBreedingStatus.requestedPet,
                userOfPet1: user1._id,
                userOfPet2: user2._id,
            });

            await updateMatched.save();
            await Breeding.deleteOne({_id: breedingStatusId});

            return res.status(200).json({
                message: "Breeding request accepted and match created",
                updatedBreedingStatus,
                updatedMatchedStatus: updateMatched
            });
        } else {
            await Breeding.deleteOne({_id: breedingStatusId});
            return res.status(200).json({
                message: "Breeding request rejected",
                updatedBreedingStatus
            });
        }
    } catch (error) {
        console.error("Error in match controller:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export default matchController;