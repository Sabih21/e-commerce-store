const mongoose = require('mongoose');

const blacklistedIPSchema = new mongoose.Schema({
  ipAddress: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlacklistedIP', blacklistedIPSchema);
