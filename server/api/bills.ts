import * as passport from 'passport';
import { passwordConfig } from '../config/passport';
import * as express from 'express';
import { Bill } from './../models/Bill';

passwordConfig(passport);

export const api = express();

api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Bill.find(function (err, bills) {
    if (err) return next(err);
    res.json(bills || []);
  });
});

api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
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

api.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
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


api.delete('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var _id = req.params.id;
  Bill.deleteOne({
    _id: _id
  }, function (err, bill) {
    if (err) return next(err);
    res.json(_id);
  });
});
