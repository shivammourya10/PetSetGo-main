import express from "express";
import CategoryController from "../controller/communityFourm/CategoryController.js";
import TopicController from "../controller/communityFourm/TopicsController.js";
import replyController from "../controller/communityFourm/ReplyController.js";
import getCategory from "../controller/communityFourm/getCategory.js";
import getTopics from "../controller/communityFourm/getTopics.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router();

router.post("/:userId/createCategory",upload.single('file'), CategoryController);
router.post("/:userId/:categoryId/topics",upload.single('file'),TopicController);
router.post("/:userId/:topicId/reply", replyController);
router.get("/:userId/categories", getCategory);
router.get("/:userId/:categoryId/topics", getTopics);

// Additional topic management routes
router.get("/:userId/topics/:topicId/replies", async (req, res) => {
  try {
    const { topicId } = req.params;
    // This would need proper implementation with Reply model
    const ReplyModel = (await import('../models/community/ReplyModel.js')).default;
    const replies = await ReplyModel.find({ topicId }).populate('createdBy');
    return res.status(200).json({ data: replies });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put("/:userId/topics/:topicId", async (req, res) => {
  try {
    const { topicId } = req.params;
    const updateData = req.body;
    // This would need proper implementation with Topic model
    const TopicModel = (await import('../models/community/TopicModel.js')).default;
    const updatedTopic = await TopicModel.findByIdAndUpdate(topicId, updateData, { new: true });
    if (!updatedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    return res.status(200).json({ message: 'Topic updated successfully', data: updatedTopic });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete("/:userId/topics/:topicId", async (req, res) => {
  try {
    const { topicId } = req.params;
    // This would need proper implementation with Topic model
    const TopicModel = (await import('../models/community/TopicModel.js')).default;
    const deletedTopic = await TopicModel.findByIdAndDelete(topicId);
    if (!deletedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    return res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;