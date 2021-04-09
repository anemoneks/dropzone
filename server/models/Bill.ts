import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  house: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
    required: true,
  },
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
  attachment: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
});

export const Bill = mongoose.model('Bill', schema);