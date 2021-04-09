"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const Bill_1 = require("./../models/Bill");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
exports.api = express();
exports.api.get('/owner', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    rxjs_1.forkJoin([
        Bill_1.Bill.find({})
    ])
        .pipe(operators_1.catchError((error) => {
        console.log(error);
        return rxjs_1.throwError(error);
    }))
        .subscribe(results => {
        const bills = results[0];
        const outstanding = (bills || []).map(x => x.amount || 0).reduce((a, b) => a + b, 0);
        res.json({
            outstanding: outstanding,
        });
    });
});
//# sourceMappingURL=dashboard.js.map