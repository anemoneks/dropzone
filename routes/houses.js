var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var House = require("../models/house");
var User = require("../models/user");

router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _id = req.params.id;
  House.deleteOne({
    _id: _id
  }, function (err, house) {
    if (err) return next(err);
    res.json(_id);
  });
});

router.get('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  House.find({})
    .populate('bills')
    .populate('users')
    .populate('payments')
    .exec((err, houses) => {
      if (err) return next(err);
      res.json(houses || []);
    });
});

router.get('/owner', passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    const token = getToken(req.headers);
    const verified = jwt.verify(token, config.secret);

    User.findOne({
        _id: verified._id
      })
      .populate('roles')
      .exec((err, user) => {

        // check if user is owner
        const found = (user.roles || []).filter(x => {
          return x.name == 'owner';
        }) || [];

        if (found.length > 0) return next();

        res.json([]);
      });
  },
  (req, res, next) => {
    const token = getToken(req.headers);
    const verified = jwt.verify(token, config.secret);

    House.find({
        'users': verified._id
      })
      .populate('bills')
      .populate('users')
      .populate('payments')
      .exec((err, houses) => {
        if (err) return next(err);
        res.json(houses || []);
      });
  });

router.get('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {
  var id = req.params.id;
  House.findOne({
      _id: id
    })
    .populate('bills')
    .populate('users')
    .populate('payments')
    .exec(function (err, house) {
      if (err) return next(err);
      res.json(house);
    });
});

router.post('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var {
    _id,
    street,
    unit,
    users,
    bills,
    payments
  } = req.body;
  House.insertMany([{
    street: street,
    unit: unit,
    users: users,
    bills: bills,
    payments: payments
  }], (err, house) => {
    if (err) return next(err);
    res.json(house);
  });
});

router.put('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {

  var {
    _id,
    street,
    unit,
    bills,
    users,
    payments
  } = req.body;

  House.update({
    _id: _id
  }, {
    $set: {
      unit: unit,
      street: street,
      bills: bills,
      users: users,
      payments: payments,
    }
  }, (err, modified) => {
    if (err) return next(err);

    res.json(modified);
  });
});

module.exports = router;
