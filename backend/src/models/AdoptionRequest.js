import mongoose from 'mongoose';

const AdoptionRequestSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  applicantEmail: {
    type: String,
    required: true
  },
  applicantPhone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  experienceWithPets: {
    type: String,
    default: ''
  },
  livingArrangement: {
    type: String,
    default: ''
  },
  reasonForAdoption: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewComments: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
AdoptionRequestSchema.index({ petId: 1 });
AdoptionRequestSchema.index({ userId: 1 });
AdoptionRequestSchema.index({ status: 1 });

const AdoptionRequest = mongoose.model('AdoptionRequest', AdoptionRequestSchema);

export default AdoptionRequest;
