import * as mongoose from 'mongoose';

var schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  documents: [{
    type: String,
    required: true
  }],
});

export const Visitor = mongoose.model('Visitor', schema);
