import * as mongoose from 'mongoose';
import * as moment from 'moment-timezone';
import * as passport from 'passport';
import * as fs from 'fs';
import { forkJoin } from 'rxjs';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { helper } from './../helper';
import { config } from './../config/database';
import { passwordConfig } from './../config/passport';
import { Payment } from './../models/Payment';
import { House } from './../models/House';

passwordConfig(passport);

export const api = express();

api.get('/', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {

  Payment.find((err, payments) => {
    if (err) return next(err);
    res.json(payments || []);
  });
});

api.get('/:id', passport.authenticate('jwt', {
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

api.post('/', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {

  const token = helper.getToken(req.headers);
  const verified: any = jwt.verify(token, config.secret);

  const payment: any = new Payment(req.body);

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

api.put('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {

  const token = helper.getToken(req.headers);
  const verified: any = jwt.verify(token, config.secret);
  const updated: any = new Payment(req.body);

  Payment.findOne({
    _id: updated._id
  }, (err, payment: any) => {
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


api.delete('/:id', passport.authenticate('jwt', {
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
        .exec((err, houses: any) => {

          (houses || []).forEach((h: any) => {
            h.payments = h.payments.filter((p: any) => p.toString() != _id) || [];
            h.save();
          });

          res.json(_id);

        });

    });
});

api.get('/download/:id', function (req: express.Request, res: express.Response, next) {
  var _id = req.params.id;
  Payment.findOne({
    _id: _id
  })
    .exec((err, payment: any) => {
      if (err) return next(err);

      let base64 = (payment.attachment || '').split(';base64,').pop();
      const file = Buffer.from(base64, 'base64');
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment;filename=${payment.filename}`);
      res.setHeader('Content-Length', file.length);
      res.write(file, 'binary');
      res.end();
    });
});
