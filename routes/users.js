var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var User = require("../models/user");

router.get('/current', function (req, res) {
  var token = getToken(req.headers);
  var verified = jwt.verify(token, config.secret);

  User.find({
      _id: verified._id
    })
    .populate('roles')
    .exec((err, users) => {
      console.log(users);
    });

  res.json({
    success: true,
    user: verified
  });
});

router.post('/signin', (req, res, next) => {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).send({
        success: false,
        msg: 'Authentication failed. User not found.'
      });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          res.json({
            success: true,
            token: 'JWT ' + token,
            user: user
          });
        } else {
          res.status(401).send({
            success: false,
            msg: 'Authentication failed. Wrong password.'
          });
        }
      });
    }
  });
});

router.post('/', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {
  const {
    _id,
    firstName,
    lastName,
    email,
    username,
    password
  } = req.body;
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    username: username,
    password: password,
    roles: [],
  });
  user.save();
  res.json(user);
});

router.get('/find/username', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  const {
    username
  } = req.query;
  User.find({
    username: username
  }, (err, users) => {
    if (err) return next(err);
    res.json(users);
  });
});

router.get('/find/email', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  const {
    email
  } = req.query;
  User.find({
    email: email
  }, (err, users) => {
    if (err) return next(err);
    res.json(users);
  });
});

router.get('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  let _id = req.params.id;
  User.find({
    _id: _id
  }, (err, users) => {
    if (err) return next(err);
    res.json(users);
  });
});

router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _id = req.params.id;
  var _id = req.params.id;
  User.deleteOne({
    _id: _id
  }, function (err, user) {
    if (err) return next(err);
    res.json(_id);
  });
});

router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  User.find((err, users) => {
    if (err) return next(err);
    res.json(users);
  });
});

router.put('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var {
    _id,
    firstName,
    lastName,
    email,
    username,
    password,
    roles,
    avatar
  } = req.body;

  User.findOne({
    _id: _id
  }, (err, user) => {

    if (err)
      return next(err);

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.username = username;

    if ((password || '').trim() != '')
      user.password = password;

    user.roles = roles;
    user.avatar = avatar;

    user.save();
    res.json(user);
  });
});

module.exports = router;
