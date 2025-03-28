const express = require('express');
const passport = require('../Config/passport');
const router = express.Router();

// Initiate Microsoft Teams authentication
router.get('/teams', 
  passport.authenticate('microsoft', { 
    prompt: 'select_account' 
  })
);

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
// code=M.C542_BAY.2.U.0ce2b0fe-2a5b-8476-395a-c2be4e846012
module.exports = router;