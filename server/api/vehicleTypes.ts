import * as passport from 'passport';
import * as express from 'express';
import { collection as vehicleType } from './../models/vehicleType';

export const api = express();

api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  vehicleType.find(function (err, vehicleTypes) {
    if (err) return next(err);
    res.json(vehicleTypes);
  });
});
