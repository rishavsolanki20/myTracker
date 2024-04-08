const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware');
const { Users, UserLog } = require('../db');

// Add authMiddleware to the route
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    // Check if the current user is an admin
    const currentUser = await Users.findById(req.userId);
    if (!currentUser.isAdmin) {
      return res.status(403).json({ message: 'Access forbidden. Only administrators are allowed to view user data.' });
    }
    
    // Fetch user data from the Users collection
    const allUsers = await Users.find({}, '-password');

    // Fetch user log data from the UserLog collection
    const allUserLogs = await UserLog.find({}).populate('user', 'username');

    // Prepare the response object with both user data and user log data
    const responseData = {
      users: allUsers,
      userLogs: allUserLogs,
    };

    // Send the response
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
