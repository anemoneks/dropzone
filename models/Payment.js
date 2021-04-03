var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = mongoose.Schema({
  referenceNo: {
    type: String,
    required: true
  },
  amount: {
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
  paidDate: {
    type: Date,
    required: true
  },
  createdDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedDate: {
    type: Date,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  },
});

try {
  module.exports = mongoose.model('Payment', schema);
} catch (e) {
  module.exports = mongoose.model('Payment');
}
