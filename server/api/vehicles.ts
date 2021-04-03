import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as express from 'express';
import { passwordConfig } from './../config/passport';
import { Vehicle } from './../models/vehicle';

passwordConfig(passport);
export const api = express();

api.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  Vehicle.find(function (err, vehicles) {
    if (err) return next(err);
    res.json(vehicles || []);
  });
});

api.post('/', passport.authenticate('jwt', { session: false }), (req: express.Request, res: express.Response, next) => {
  const vehicle: any = new Vehicle(req.body);
  Vehicle.insertMany([{
    invoiceNo: vehicle.invoiceNo,
    amount: vehicle.amount,
    vehicleMonth: vehicle.vehicleMonth,
    vehicleYear: vehicle.vehicleYear,
    status: vehicle.status,
  }], (err, vehicle) => {
    if (err) return next(err);
    res.json(vehicle);
  });
});

api.put('/', passport.authenticate('jwt', { session: false }), (req: express.Request, res: express.Response, next) => {
  const vehicle: any = new Vehicle(req.body);
  Vehicle.findOne({ _id: vehicle._id }, (err, vehicle: any) => {
    if (err) return next(err);
    vehicle.invoiceNo = vehicle.invoiceNo;
    vehicle.amount = vehicle.amount;
    vehicle.vehicleMonth = vehicle.vehicleMonth;
    vehicle.vehicleYear = vehicle.vehicleYear;
    vehicle.status = vehicle.status;
    vehicle.save();
    res.json(vehicle);
  });
});


api.delete('/:id', passport.authenticate('jwt', {
  session: false
}), (req: express.Request, res: express.Response) => {
  var _id = req.params.id;
  Vehicle.deleteOne({
    _id: _id
  }).exec((deleted) => {
    res.json(_id);
  });
});
