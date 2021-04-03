import * as passport from 'passport';
import * as express from 'express';
import { Visitor } from '../models/visitor';
import { passwordConfig } from '../config/passport';

passwordConfig(passport);

export const api = express();

api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Visitor.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const { _id, firstName, lastName, gender } = req.body;
  const visitor: any = new Visitor();
  visitor.firstName = firstName;
  visitor.lastName = lastName;
  visitor.gender = gender;
  visitor.save();
  res.json(visitor);
});