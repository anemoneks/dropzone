"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const VisitingPurpose_1 = require("./../models/VisitingPurpose");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    VisitingPurpose_1.VisitingPurpose.find(function (err, users) {
        if (err)
            return next(err);
        res.json(users);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    var id = req.params.id;
    VisitingPurpose_1.VisitingPurpose.findOne({ _id: id })
        .exec(function (err, role) {
        if (err)
            return next(err);
        res.json(role);
    });
});
//# sourceMappingURL=visitingPurposes.js.map