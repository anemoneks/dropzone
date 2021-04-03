const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../config/database');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Bill = require("../models/bill");

router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  Bill.find(function (err, bills) {
    if (err) return next(err);
    res.json(bills || []);
  });
});

router.post('/', passport.authenticate('jwt', { session: false }), function (req, res) {
  const bill = new Bill(req.body);
  Bill.insertMany([{
    invoiceNo: bill.invoiceNo,
    amount: bill.amount,
    billMonth: bill.billMonth,
    billYear: bill.billYear,
    status: bill.status,
  }], (err, bill) => {
    if (err) return next(err);
    res.json(bill);
  });
});

router.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const bill = new Bill(req.body);
  Bill.findOne({ _id: bill._id }, (err, bill) => {
    if (err) return next(err);
    bill.invoiceNo = bill.invoiceNo;
    bill.amount = bill.amount;
    bill.billMonth = bill.billMonth;
    bill.billYear = bill.billYear;
    bill.status = bill.status;
    bill.save();
    res.json(bill);
  });
});


router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _id = req.params.id;
  Bill.deleteOne({
    _id: _id
  }, function (err, bill) {
    if (err) return next(err);
    res.json(_id);
  });
});

module.exports = router;