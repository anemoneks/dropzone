import * as mongoose from 'mongoose';

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
});

export const Role = mongoose.model('Role', schema);
