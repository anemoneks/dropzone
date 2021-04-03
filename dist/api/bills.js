"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const passport_1 = require("../config/passport");
const express = require("express");
const Bill_1 = require("./../models/Bill");
passport_1.passwordConfig(passport);
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Bill_1.Bill.find(function (err, bills) {
        if (err)
            return next(err);
        res.json(bills || []);
    });
});
exports.api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const bill = new Bill_1.Bill(req.body);
    Bill_1.Bill.insertMany([{
            invoiceNo: bill.invoiceNo,
            amount: bill.amount,
            billMonth: bill.billMonth,
            billYear: bill.billYear,
            status: bill.status,
        }], (err, bill) => {
        if (err)
            return next(err);
        res.json(bill);
    });
});
exports.api.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const bill = new Bill_1.Bill(req.body);
    Bill_1.Bill.findOne({ _id: bill._id }, (err, bill) => {
        if (err)
            return next(err);
        bill.invoiceNo = bill.invoiceNo;
        bill.amount = bill.amount;
        bill.billMonth = bill.billMonth;
        bill.billYear = bill.billYear;
        bill.status = bill.status;
        bill.save();
        res.json(bill);
    });
});
exports.api.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var _id = req.params.id;
    Bill_1.Bill.deleteOne({
        _id: _id
    }, function (err, bill) {
        if (err)
            return next(err);
        res.json(_id);
    });
});
//# sourceMappingURL=bills.js.map