'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const time = require('../libs/timeLib');

const Login = new Schema({
  userId: {
    type: String,
    required:true,
    index:true
  },
  authToken: {
    type: String,
    required:true
  },
  tokenSecret: {
    type: String
  },
  tokenGenerationTime: {
    type: Date,
    default: time.now()
  }
});

module.exports = mongoose.model('login', Login);
