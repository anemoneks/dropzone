"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const jwt = require("jsonwebtoken");
const helper_1 = require("./../helper");
const database_1 = require("./../config/database");
const passport_1 = require("./../config/passport");
const Payment_1 = require("./../models/Payment");
const House_1 = require("./../models/House");
passport_1.passwordConfig(passport);
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', {
    session: false
}), function (req, res, next) {
    Payment_1.Payment.find((err, payments) => {
        if (err)
            return next(err);
        res.json(payments || []);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let _id = req.params.id;
    Payment_1.Payment.findOne({
        _id: _id,
    }, (err, payment) => {
        if (err)
            return next(err);
        res.json(payment);
    });
});
exports.api.post('/', passport.authenticate('jwt', {
    session: false
}), function (req, res, next) {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    const payment = new Payment_1.Payment(req.body);
    Payment_1.Payment.insertMany([{
            paidDate: payment.paidDate,
            referenceNo: payment.referenceNo,
            amount: payment.amount,
            attachment: payment.attachment,
            filename: payment.filename,
            createdDate: new Date(),
            createdBy: verified.username,
            updatedDate: new Date(),
            updatedBy: verified.username,
        }], (err, payment) => {
        if (err)
            return next(err);
        res.json(payment);
    });
});
exports.api.put('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    const updated = new Payment_1.Payment(req.body);
    Payment_1.Payment.findOne({
        _id: updated._id
    }, (err, payment) => {
        if (err)
            return next(err);
        payment.referenceNo = updated.referenceNo;
        payment.amount = updated.amount;
        payment.attachment = updated.attachment;
        payment.filename = updated.filename;
        payment.paidDate = updated.paidDate;
        payment.updatedDate = new Date();
        payment.updatedBy = verified.username;
        payment.save();
        res.json(payment);
    });
});
exports.api.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    var _id = req.params.id;
    Payment_1.Payment.deleteOne({
        _id: _id
    })
        .exec((err, deleted) => {
        House_1.House.find({
            'payments': _id
        })
            .exec((err, houses) => {
            (houses || []).forEach((h) => {
                h.payments = h.payments.filter((p) => p.toString() != _id) || [];
                h.save();
            });
            res.json(_id);
        });
    });
});
exports.api.get('/download/:id', function (req, res, next) {
    var _id = req.params.id;
    Payment_1.Payment.findOne({
        _id: _id
    })
        .exec((err, payment) => {
        if (err)
            return next(err);
        let base64 = (payment.attachment || '').split(';base64,').pop();
        const file = Buffer.from(base64, 'base64');
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment;filename=${payment.filename}`);
        res.setHeader('Content-Length', file.length);
        res.write(file, 'binary');
        res.end();
    });
});
//# sourceMappingURL=payments.js.map