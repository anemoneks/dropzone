var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = mongoose.Schema({
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


try {
  module.exports = mongoose.model('Bill', schema);
} catch (e) {
  module.exports = mongoose.model('Bill');
}
