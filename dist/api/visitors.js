"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const visitor_1 = require("../models/visitor");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    visitor_1.Visitor.find({})
        .populate('house')
        .populate('race')
        .populate('vehicleType')
        .populate('visitingPurpose')
        .exec((err, visitors) => {
        if (err)
            return next(err);
        res.json(visitors);
    });
    ;
});
exports.api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { _id, firstName, lastName, gender, vehicleNo, raceId, vehicleTypeId, houseId, visitingPurposeId } = req.body;
    const visitor = new visitor_1.Visitor();
    visitor.firstName = firstName;
    visitor.lastName = lastName;
    visitor.vehicleNo = vehicleNo;
    visitor.gender = gender;
    visitor.race = raceId;
    visitor.vehicleType = vehicleTypeId;
    visitor.house = houseId;
    visitor.visitingPurpose = visitingPurposeId;
    visitor.visitedDate = new Date();
    visitor.save();
    res.json(visitor);
});
exports.api.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res, next) {
    var _id = req.params.id;
    visitor_1.Visitor.deleteOne({
        _id: _id
    }).exec(deleted => {
        res.json(_id);
    });
});
//# sourceMappingURL=visitors.js.map