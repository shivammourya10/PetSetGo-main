import express from 'express';
import {upload} from "../middlewares/multer.middleware.js"
import medprescription from "../controller/MedicalController/MedController.js"
const router = express.Router();

// Add medical prescription (fixed field name to match frontend)
router.post('/:petId/medicalPresc',upload.single('Prescerption'),medprescription);

// Get medical records for a pet
router.get('/:petId/records', async (req, res) => {
  try {
    const { petId } = req.params;
    const MedicalSchema = (await import('../models/Medical/MedicalSchema.js')).default;
    const records = await MedicalSchema.find({ petId });
    return res.status(200).json({ data: records });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;