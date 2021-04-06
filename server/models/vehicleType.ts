import * as mongoose from 'mongoose';

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
});

export const collection = mongoose.model('VehicleType', schema);
