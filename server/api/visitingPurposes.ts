import * as passport from 'passport';
import * as express from 'express';
import { VisitingPurpose } from './../models/VisitingPurpose';

export const api = express();

api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  VisitingPurpose.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var id = req.params.id;
  VisitingPurpose.findOne({ _id: id })
    .exec(function (err, role) {
      if (err) return next(err);
      res.json(role);
    });
});
