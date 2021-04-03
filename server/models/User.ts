import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import e = require('express');

const Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  avatar: {
    type: Object,
    required: false
  },
});

userSchema.pre('save', (user: any, next: any) => {
  if (user.isModified('password') || user.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.getFullName = function () {
  return this.firstName + this.lastName;
}

userSchema.methods.comparePassword = (passw: string, cb: any) => {
  const user: any = this;

  return cb(null, true);

  bcrypt.compare(passw, user.password, (err: any, isMatch: boolean) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

export const User = mongoose.model('User', userSchema);
