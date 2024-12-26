const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  User_id: String,
  Email: String,
  User_pin: String,
}, { collection: 'Verified_Users' }); // Explicitly set the collection name

const User = mongoose.model('User', userSchema);

module.exports = User;
