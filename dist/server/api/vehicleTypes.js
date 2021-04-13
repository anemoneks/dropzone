"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const vehicleType_1 = require("./../models/vehicleType");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    vehicleType_1.collection.find(function (err, vehicleTypes) {
        if (err)
            return next(err);
        res.json(vehicleTypes);
    });
});
//# sourceMappingURL=vehicleTypes.js.map