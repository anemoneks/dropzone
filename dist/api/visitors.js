"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const visitor_1 = require("../models/visitor");
const passport_1 = require("../config/passport");
passport_1.passwordConfig(passport);
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    visitor_1.Visitor.find(function (err, users) {
        if (err)
            return next(err);
        res.json(users);
    });
});
exports.api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { _id, firstName, lastName, gender } = req.body;
    const visitor = new visitor_1.Visitor();
    visitor.firstName = firstName;
    visitor.lastName = lastName;
    visitor.gender = gender;
    visitor.save();
    res.json(visitor);
});
//# sourceMappingURL=visitors.js.map