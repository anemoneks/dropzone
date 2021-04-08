import * as passport from 'passport';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { helper } from './../helper';
import { config } from './../config/database';
import { collection as Receipt } from './../models/receipt';
import { House } from './../models/House';

export const api = express();

api.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {

  Receipt.find({})
    .populate('house')
    .exec(function (err, receipts) {
      if (err) return next(err);
      res.json(receipts);
    });
});

api.get('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  let _id = req.params.id;
  Receipt.findOne({
    _id: _id,
  }).populate('house')
    .exec(function (err, receipt) {
      if (err) return next(err);
      res.json(receipt);
    });
});

api.post('/', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {

  const token = helper.getToken(req.headers);
  const verified: any = jwt.verify(token, config.secret);

  const { _id, houseId, referenceNo, amount, attachment, filename, issuedDate, createdDate, createdBy, updatedDate, updatedBy } = req.body;

  Receipt.insertMany([{
    house: houseId,
    issuedDate: issuedDate,
    referenceNo: referenceNo,
    amount: amount,
    attachment: attachment,
    filename: filename,
    createdDate: new Date(),
    createdBy: verified.username,
    updatedDate: new Date(),
    updatedBy: verified.username,
  }], (err, receipt) => {
    if (err) return next(err);
    res.json(receipt);
  });
});

api.put('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {

  const token = helper.getToken(req.headers);
  const verified: any = jwt.verify(token, config.secret);
  const { _id, houseId, referenceNo, amount, attachment, filename, issuedDate, createdDate, createdBy, updatedDate, updatedBy } = req.body;

  Receipt.findOne({
    _id: _id
  }, (err, receipt: any) => {
    if (err) return next(err);
    receipt.house = houseId;
    receipt.referenceNo = referenceNo;
    receipt.amount = amount;
    receipt.attachment = attachment;
    receipt.filename = filename;
    receipt.issuedDate = issuedDate;
    receipt.updatedDate = new Date();
    receipt.updatedBy = verified.username;
    receipt.save();
    res.json(receipt);
  });
});


api.delete('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _id = req.params.id;

  Receipt.deleteOne({
    _id: _id
  })
    .exec((err, deleted) => {

      House.find({
        'receipts': _id
      })
        .exec((err, houses: any) => {

          (houses || []).forEach((h: any) => {
            h.receipts = h.receipts.filter((p: any) => p.toString() != _id) || [];
            h.save();
          });

          res.json(_id);

        });

    });
});

api.get('/download/:id', function (req: express.Request, res: express.Response, next) {
  var _id = req.params.id;
  Receipt.findOne({
    _id: _id
  })
    .exec((err, receipt: any) => {
      if (err) return next(err);

      let base64 = (receipt.attachment || '').split(';base64,').pop();
      const file = Buffer.from(base64, 'base64');
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment;filename=${receipt.filename}`);
      res.setHeader('Content-Length', file.length);
      res.write(file, 'binary');
      res.end();
    });
});
