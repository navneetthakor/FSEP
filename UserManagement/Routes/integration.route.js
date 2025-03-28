const express = require('express');
const passport = require('../Config/passport');
const fetchUser = require('../Middelwares/fetchUser.middelware');
const router = express.Router();

/// Initiate Microsoft Teams authentication
router.get('/teams',fetchUser, (req, res, next) => {
    // Capture userId 
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    // Store userId in session for callback
    req.session.userId = userId;
  
    // Proceed with authentication
    passport.authenticate('microsoft', { 
      prompt: 'select_account',
      state: userId // Pass userId as state
    })(req, res, next);
  });
  
  // Callback route after Microsoft authentication
  router.get('/teams/callback', 
    passport.authenticate('microsoft', { 
      failureRedirect: '/integration-failed' 
    }),
    (req, res) => {
      // Successful authentication, redirect to frontend
      res.redirect(`${process.env.FRONTEND_URL}/`);
    }
  );
  
  module.exports = router;