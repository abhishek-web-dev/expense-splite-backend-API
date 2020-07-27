'use strict';
/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

let userDetailsSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  name: {
    type: String,
    required:true
  },
  password: {
    type: String,
    required:true
  },
  email: {
    type: String,
    unique:true
  },
  mobile: {
    type:Object,
    required:true
  },
  createdOn :{
    type:Date,
    default: Date.now()
  }

});


module.exports = mongoose.model('userdetails', userDetailsSchema);