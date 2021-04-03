import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  unit: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  bills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill'
  }],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  vehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
});

export const House = mongoose.model('House', schema);
