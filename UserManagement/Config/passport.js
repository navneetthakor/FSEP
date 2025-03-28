const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const { saveUserToDatabase, getUserFromDatabase } = require('./database');

// Microsoft Teams OAuth Strategy
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/teams/callback`,
    scope: ['user.read', 'offline_access', 'team.readbasic.all'],
    passReqToCallback: true,  // Pass request object to callback
  },
  async (req,accessToken, refreshToken, profile, done) => {
    console.log(req.query.userId);
    try {
      const user = {
        user_id : req.query.userId,
        microsoftId: profile.id,
        displayName: profile.displayName,
        email: profile._json.mail,
        accessToken,
        refreshToken
      };
      
      const savedUser = await saveUserToDatabase(user);
      return done(null, savedUser);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserFromDatabase(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;