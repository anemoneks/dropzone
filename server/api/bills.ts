import * as passport from 'passport';
import * as express from 'express';
import { Bill } from './../models/Bill';

export const api = express();

api.get('/owner/dashboard', passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Bill.find((err, bills) => {
      if (err) return next(err);

      const outstandingBalance = ((bills || []).map(x => {
        return x.amount || 0;
      }) || [])
        .reduce((a, b) => {
          return a + b;
        }, 0);

      res.json({
        outstandingBalance: outstandingBalance,
      });
    });
  });

api.get('/', passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Bill.find((err, bills) => {
      if (err) return next(err);
      res.json(bills || []);
    });
  });

api.get('/:id', passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    let _id = req.params.id;
    Bill.findOne({
      _id: _id,
    }).populate('house')
      .exec(function (err, bill) {
        if (err) return next(err);
        res.json(bill);
      });
  });

api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const { houseId, invoiceNo, amount, billMonth, billYear, attachment, filename } = (req.body);
  Bill.insertMany([{
    house: houseId,
    invoiceNo: invoiceNo,
    amount: amount,
    billMonth: billMonth,
    billYear: billYear,
    status: 1,
    attachment: attachment,
    filename: filename,
  }], (err, bill) => {
    if (err) return next(err);
    res.json(bill);
  });
});

api.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const { houseId, _id, invoiceNo, amount, billMonth, billYear, status, attachment, filename } = req.body;
  Bill.findOne({ _id: _id }, (err, bill) => {
    if (err) return next(err);
    bill.house = houseId;
    bill.invoiceNo = invoiceNo;
    bill.amount = amount;
    bill.billMonth = billMonth;
    bill.billYear = billYear;
    bill.attachment = attachment;
    bill.filename = filename;
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
