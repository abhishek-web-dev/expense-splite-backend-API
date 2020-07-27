'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupId: {
    type: String,
    required:true,
    index:true
  },
  gname: {
    type: String,
    required:true
  },
  creatorId: {
    type: String,
    required: true
  },
  creatorName: {
    type: String,
    required: true
  },
  groupMemberIds: {
      type: Array
  },
  createdOn: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('group', groupSchema);



