/**
 * Test controller to list users for debugging purposes
 */

import User from "../../models/User/UserSchema.js";

const listUsers = async (req, res) => {
  try {
    // Find all users but only return safe fields (not passwords)
    const users = await User.find({}, 'name userName email _id').limit(10);
    
    return res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export default listUsers;
