import * as passport from 'passport';
import * as express from 'express';
import { Role } from './../models/Role';

export const api = express();

api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Role.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var id = req.params.id;
  Role.findOne({ _id: id })
    .exec(function (err, role) {
      if (err) return next(err);
      res.json(role);
    });
});

api.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var { _id, name } = req.body;

  Role.findOne({ _id: _id })
    .exec((err, role: any) => {
      if (err) return next(err);
      role.name = name;
      role.save();
      res.json(role);
    });
});

api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const { _id, name } = req.body;
  const role: any = new Role();
  role.name = name;
  role.save();
  res.json(role);
});

api.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  var _id = req.params.id;
  Role.deleteOne({ _id: _id }).exec();
});
