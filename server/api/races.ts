import * as passport from 'passport';
import * as express from 'express';
import { Race } from './../models/Race';

export const api = express();

api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Race.find(function (err, races) {
    if (err) return next(err);
    res.json(races);
  });
});

api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var id = req.params.id;
  Race.findOne({ _id: id })
    .exec(function (err, role) {
      if (err) return next(err);
      res.json(role);
    });
});
