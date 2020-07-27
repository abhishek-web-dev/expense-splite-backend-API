'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  expenseId: {
    type: String,
    required:true,
    index:true
  },
  groupId:{
      type:String,
      required:true
  },
  ename: {
    type: String,
    required:true
  },
  amount:{
      type:Number,
      default:0
  },
  creatorId: {
    type: String,
    required: true
  },
  creatorName: {
    type: String,
    required: true
  },
  updatedById: {
    type:String,
    required: true
  },
  updatedByName: {
    type:String,
    required: true
  },
  contributer: {
      type: Array
  },
  distributer:{
      type:Array
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  updatedOn: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('expense', expenseSchema);



