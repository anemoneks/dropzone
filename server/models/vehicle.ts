import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  plateNo: {
    type: String,
    required: true
  },
});

export const Vehicle = mongoose.model('Vehicle', schema);
