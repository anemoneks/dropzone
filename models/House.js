const mongoose = require('mongoose');

const schema = mongoose.Schema({
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
});

try {
  module.exports = mongoose.model('House', schema);
} catch (e) {
  module.exports = mongoose.model('House');
}
