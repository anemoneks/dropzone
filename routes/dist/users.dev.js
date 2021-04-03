"use strict";

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
  res.json({
    success: true,
    user: verified
  });
});
router.post('/signin', function (req, res, next) {
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
          var token = jwt.sign(user.toJSON(), config.secret); // return the information including token as JSON

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
  var _req$body = req.body,
      _id = _req$body._id,
      firstName = _req$body.firstName,
      lastName = _req$body.lastName,
      email = _req$body.email,
      username = _req$body.username,
      password = _req$body.password;
  var user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    username: username,
    password: password,
    roles: []
  });
  user.save();
  res.json(user);
});
router.get('/find/username', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {
  var username = req.query.username;
  User.find({
    username: username
  }, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});
router.get('/find/email', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {
  var email = req.query.email;
  User.find({
    email: email
  }, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});
router.get('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {
  var _id = req.params.id;
  User.find({
    _id: _id
  }, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});
router["delete"]('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _id = req.params.id;
  User.deleteOne({
    _id: _id
  }).exec();
});
router.get('/', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});
router.put('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _req$body2 = req.body,
      _id = _req$body2._id,
      firstName = _req$body2.firstName,
      lastName = _req$body2.lastName,
      email = _req$body2.email,
      username = _req$body2.username,
      password = _req$body2.password,
      roles = _req$body2.roles,
      avatar = _req$body2.avatar;
  User.findOne({
    _id: _id
  }, function (err, user) {
    if (err) return next(err);
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.username = username;
    if ((password || '').trim() != '') user.password = password;
    user.roles = roles;
    user.avatar = avatar;
    user.save();
    res.json(user);
  });
});
module.exports = router;