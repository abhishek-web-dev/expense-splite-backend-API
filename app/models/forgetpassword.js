'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgetPassSchema = new Schema({
  codeId: {
    type: String,
    required:true,
    index:true
  },
  userId:{
      type:String,
      required:true
  },
  name:{
      type: String,
      required: true
  },
  email: {
    type: String,
    required:true
  },
  createdOn: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('forgetpassword', forgetPassSchema);



