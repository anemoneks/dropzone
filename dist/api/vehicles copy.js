"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const passport_1 = require("./../config/passport");
const vehicle_1 = require("./../models/vehicle");
passport_1.passwordConfig(passport);
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    vehicle_1.Vehicle.find(function (err, vehicles) {
        if (err)
            return next(err);
        res.json(vehicles || []);
    });
});
exports.api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const vehicle = new vehicle_1.Vehicle(req.body);
    vehicle_1.Vehicle.insertMany([{
            invoiceNo: vehicle.invoiceNo,
            amount: vehicle.amount,
            vehicleMonth: vehicle.vehicleMonth,
            vehicleYear: vehicle.vehicleYear,
            status: vehicle.status,
        }], (err, vehicle) => {
        if (err)
            return next(err);
        res.json(vehicle);
    });
});
exports.api.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const vehicle = new vehicle_1.Vehicle(req.body);
    vehicle_1.Vehicle.findOne({ _id: vehicle._id }, (err, vehicle) => {
        if (err)
            return next(err);
        vehicle.invoiceNo = vehicle.invoiceNo;
        vehicle.amount = vehicle.amount;
        vehicle.vehicleMonth = vehicle.vehicleMonth;
        vehicle.vehicleYear = vehicle.vehicleYear;
        vehicle.status = vehicle.status;
        vehicle.save();
        res.json(vehicle);
    });
});
exports.api.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    var _id = req.params.id;
    vehicle_1.Vehicle.deleteOne({
        _id: _id
    }).exec((deleted) => {
        res.json(_id);
    });
});
//# sourceMappingURL=vehicles copy.js.map