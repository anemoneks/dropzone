"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const Bill_1 = require("./../models/Bill");
const House_1 = require("./../models/House");
const helper_1 = require("./../helper");
const jwt = require("jsonwebtoken");
const database_1 = require("../config/database");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Bill_1.Bill.find()
        .populate('house')
        .exec((err, bills) => {
        if (err)
            return next(err);
        res.json(bills || []);
    });
});
exports.api.get('/owner', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    House_1.House.find({ users: { $in: [verified._id] } }, (err, houses) => {
        if (err)
            return next(err);
        Bill_1.Bill.find({ house: { $in: houses } })
            .populate('house')
            .exec((err, bills) => {
            if (err)
                return next(err);
            res.json(bills || []);
        });
    });
});
exports.api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let _id = req.params.id;
    Bill_1.Bill.findOne({
        _id: _id,
    }).populate('house')
        .exec(function (err, bill) {
        if (err)
            return next(err);
        res.json(bill);
    });
});
exports.api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { houseId, invoiceNo, amount, billMonth, billYear, attachment, filename } = (req.body);
    Bill_1.Bill.insertMany([{
            house: houseId,
            invoiceNo: invoiceNo,
            amount: amount,
            billMonth: billMonth,
            billYear: billYear,
            status: 0,
            attachment: attachment,
            filename: filename,
        }], (err, bill) => {
        if (err)
            return next(err);
        res.json(bill);
    });
});
exports.api.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { houseId, _id, invoiceNo, amount, billMonth, billYear, status, attachment, filename } = req.body;
    Bill_1.Bill.findOne({ _id: _id }, (err, bill) => {
        if (err)
            return next(err);
        bill.house = houseId;
        bill.invoiceNo = invoiceNo;
        bill.amount = amount;
        bill.billMonth = billMonth;
        bill.billYear = billYear;
        bill.attachment = attachment;
        bill.filename = filename;
        bill.status = status !== null && status !== void 0 ? status : bill.status;
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