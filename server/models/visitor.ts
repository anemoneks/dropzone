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
  vehicleNo: {
    type: String,
    required: true
  },
  race: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Race'
  },
  vehicleType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleType'
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House'
  },
  visitingPurpose: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VisitingPurpose'
  },
  visitedDate: {
    type: Date,
    required: true,
  },
  documents: [{
    type: String,
    required: true
  }],
});

export const Visitor = mongoose.model('Visitor', schema);
