import * as mongoose from 'mongoose';

var schema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
});

export const VisitingPurpose = mongoose.model('VisitingPurpose', schema);
