import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  billMonth: {
    type: Number,
    required: true
  },
  billYear: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
});

export const Bill = mongoose.model('Bill', schema);