const mongoose = require('mongoose');
const moment = require('moment-timezone');
const passport = require('passport');
const fs = require('fs');
const rxjs = require('rxjs');
const config = require('../config/database');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Payment = require("../models/payment");
const House = require("../models/house");
const {
  defaultIfEmpty
} = require('rxjs-compat/operator/defaultIfEmpty');

router.get('/', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {

  Payment.find((err, payments) => {
    if (err) return next(err);
    res.json(payments || []);
  });
});

router.get('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  let _id = req.params.id;
  Payment.findOne({
    _id: _id,
  }, (err, payment) => {
    if (err) return next(err);
    res.json(payment);
  });
});

router.post('/', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {

  const token = getToken(req.headers);
  const verified = jwt.verify(token, config.secret);

  const payment = new Payment(req.body);

  Payment.insertMany([{
    paidDate: payment.paidDate,
    referenceNo: payment.referenceNo,
    amount: payment.amount,
    attachment: payment.attachment,
    filename: payment.filename,
    createdDate: new Date(),
    createdBy: verified.username,
    updatedDate: new Date(),
    updatedBy: verified.username,
  }], (err, payment) => {
    console.log(err);
    if (err) return next(err);
    res.json(payment);
  });
});

router.put('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {

  const token = getToken(req.headers);
  const verified = jwt.verify(token, config.secret);

  const updated = new Payment(req.body);
  Payment.findOne({
    _id: updated._id
  }, (err, payment) => {
    if (err) return next(err);
    payment.referenceNo = updated.referenceNo;
    payment.amount = updated.amount;
    payment.attachment = updated.attachment;
    payment.filename = updated.filename;
    payment.paidDate = updated.paidDate;
    payment.updatedDate = new Date();
    payment.updatedBy = verified.username;
    payment.save();
    res.json(payment);
  });
});


router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _id = req.params.id;

  Payment.deleteOne({
      _id: _id
    })
    .exec((err, deleted) => {

      House.find({
          'payments': _id
        })
        .exec((err, houses) => {

          (houses || []).forEach(h => {
            h.payments = h.payments.filter(p => p.toString() != _id) || [];
            h.save();
          });

          res.json(_id);

        });

    });
});

router.get('/download/:id', function (req, res) {
  var _id = req.params.id;
  Payment.findOne({
      _id: _id
    })
    .exec((err, payment) => {
      if (err) return next(err);

      let base64 = (payment.attachment || '').split(';base64,').pop();
      const file = Buffer.from(base64, 'base64');
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment;filename=${ payment.filename }`);
      res.setHeader('Content-Length', file.length);
      res.write(file, 'binary');
      res.end();
    });
});

module.exports = router;
