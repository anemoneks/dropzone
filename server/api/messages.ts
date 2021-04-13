import * as passport from 'passport';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { helper } from './../helper';
import { config } from './../config/database';
import { collection as Message } from './../models/message';
import { House } from './../models/House';
import { create } from 'domain';

export const api = express();

api.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {

  Message.find({})
    .populate('house')
    .exec(function (err, messages) {
      if (err) return next(err);
      res.json(messages);
    });
});

api.get('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  let _id = req.params.id;
  Message.findOne({
    _id: _id,
  }).populate('house')
    .exec(function (err, message) {
      if (err) return next(err);
      res.json(message);
    });
});

api.post('/', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {

  const token = helper.getToken(req.headers);
  const verified: any = jwt.verify(token, config.secret);

  const { _id, house, subject, body, unread, createdDate, createdBy, updatedDate, updatedBy } = req.body;

  Message.insertMany([{
    house: house,
    subject: subject,
    body: body,
    unread: unread,
    createdBy: createdBy,
    createdDate: createdDate,
    updatedBy: updatedBy,
    updatedDate: updatedDate,
  }], (err, message) => {
    if (err) return next(err);
    res.json(message);
  });
});

api.put('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {

  const token = helper.getToken(req.headers);
  const verified: any = jwt.verify(token, config.secret);
  const { _id, house, subject, body, unread, createdDate, createdBy, updatedDate, updatedBy } = req.body;

  Message.findOne({
    _id: _id
  }, (err, message: any) => {
    if (err) return next(err);
    message.save();
    res.json(message);
  });
});


api.delete('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _id = req.params.id;

  Message.deleteOne({
    _id: _id
  })
    .exec((err, deleted) => {
      if (err) return err;
      res.json(deleted);
    });
});
