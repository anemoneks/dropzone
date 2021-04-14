import * as mongoose from 'mongoose';

var schema = new mongoose.Schema({
  houses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House'
  }],
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdDate: {
    type: Date,
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedDate: {
    type: Date,
    required: true,
  },
  unread: {
    type: Boolean,
    required: true,
  },
});

export const collection = mongoose.model('Message', schema);
