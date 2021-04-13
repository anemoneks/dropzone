"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const Bill_1 = require("./../models/Bill");
const Payment_1 = require("./../models/Payment");
const document_1 = require("./../models/document");
const House_1 = require("./../models/House");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helper_1 = require("./../helper");
const jwt = require("jsonwebtoken");
const database_1 = require("../config/database");
exports.api = express();
exports.api.get('/owner', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    House_1.House.find({ users: { $in: [verified._id] } }, (err, houses) => {
        if (err)
            return next(err);
        rxjs_1.forkJoin([
            Bill_1.Bill.find({ house: { $in: houses } }),
            Payment_1.Payment.find({ house: { $in: houses } }),
            document_1.Document.find({}),
        ])
            .pipe(operators_1.catchError((error) => {
            console.log(error);
            return rxjs_1.throwError(error);
        }))
            .subscribe(results => {
            var _a;
            const bills = results[0] || [];
            const payments = results[1] || [];
            const memo = (results[2] || []).filter(x => x.documentType == 1);
            const outstanding = bills.map(x => x.amount || 0).reduce((a, b) => a + b, 0);
            const paid = payments.map(x => x.amount || 0).reduce((a, b) => a + b, 0);
            const sorted = payments.sort((a, b) => {
                return b.paidDate - a.paidDate;
            }) || [];
            res.json({
                outstanding: outstanding,
                paid: paid,
                lastPaidDate: (_a = (sorted[0] || null)) === null || _a === void 0 ? void 0 : _a.paidDate,
                memo: memo.length,
            });
        });
    });
});
//# sourceMappingURL=dashboard.js.map