"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const Race_1 = require("./../models/Race");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Race_1.Race.find(function (err, races) {
        if (err)
            return next(err);
        res.json(races);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    var id = req.params.id;
    Race_1.Race.findOne({ _id: id })
        .exec(function (err, role) {
        if (err)
            return next(err);
        res.json(role);
    });
});
//# sourceMappingURL=races.js.map