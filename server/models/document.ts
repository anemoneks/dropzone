import * as mongoose from 'mongoose';

var schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  attachment: {
    type: String,
    required: true
  },
  documentType: {
    type: Number,
    required: true
  },
  releasedDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdDate: {
    type: Date,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedDate: {
    type: Date,
    required: true
  },
});

export const Document = mongoose.model('Document', schema);
