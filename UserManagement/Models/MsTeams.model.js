const mongoose = require('mongoose');

const MTUserSchema = new mongoose.Schema({
  microsoftId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  displayName: String,
  email: String,
  accessToken: String,
  refreshToken: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('MTUser', MTUserSchema);