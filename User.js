'use strict';

var exports = module.exports = {};

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  nonce: { type: String, required: false },
  loginAttempts: Number,
  isLocked: Boolean,
  email: {
    type: String,
    required: true,
    unique: "EMAIL_ALREADY_EXIST"
  },
  phone: String,
  authType: { type: String, required: true },
  roles: { type: [String], required: true },
  memberOf: { type: [], required: false },
  lastLogin: { type: Date, required: false },
  modified: { type: Date, required: true, default: Date.now() },
  created: { type: Date, required: true, default: Date.now() },
  emailNotifications: Boolean,
  languagePreference: String,
  subordinates: { type: [Schema.Types.ObjectId], required: false },
  status: { type: String, required: false },
  lastStatusChange: { type: Date, required: false },
});

exports.User = mongoose.model('User', UserSchema);
