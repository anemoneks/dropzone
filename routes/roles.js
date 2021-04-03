var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Role = require("../models/role");

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Role.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var id = req.params.id;
  Role.findOne({ _id: id })
    .exec(function (err, role) {
      if (err) return next(err);
      res.json(role);
    });
});

router.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var { _id, name } = req.body;

  Role.findOne({ _id: _id })
    .exec((err, role) => {
      if (err) return next(err);
      role.name = name;
      role.save();
      res.json(role);
    });
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const { _id, name } = req.body;
  const role = new Role();
  role.name = name;
  role.save();
  res.json(role);
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  var _id = req.params.id;
  Role.deleteOne({ _id: _id }).exec();
});

module.exports = router;