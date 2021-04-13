"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const jwt = require("jsonwebtoken");
const helper_1 = require("./../helper");
const database_1 = require("./../config/database");
const receipt_1 = require("./../models/receipt");
const House_1 = require("./../models/House");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    receipt_1.collection.find({})
        .populate('house')
        .exec(function (err, receipts) {
        if (err)
            return next(err);
        res.json(receipts);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let _id = req.params.id;
    receipt_1.collection.findOne({
        _id: _id,
    }).populate('house')
        .exec(function (err, receipt) {
        if (err)
            return next(err);
        res.json(receipt);
    });
});
exports.api.post('/', passport.authenticate('jwt', {
    session: false
}), function (req, res, next) {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    const { _id, houseId, referenceNo, amount, attachment, filename, issuedDate, createdDate, createdBy, updatedDate, updatedBy } = req.body;
    receipt_1.collection.insertMany([{
            house: houseId,
            issuedDate: issuedDate,
            referenceNo: referenceNo,
            amount: amount,
            attachment: attachment,
            filename: filename,
            createdDate: new Date(),
            createdBy: verified.username,
            updatedDate: new Date(),
            updatedBy: verified.username,
        }], (err, receipt) => {
        if (err)
            return next(err);
        res.json(receipt);
    });
});
exports.api.put('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    const { _id, houseId, referenceNo, amount, attachment, filename, issuedDate, createdDate, createdBy, updatedDate, updatedBy } = req.body;
    receipt_1.collection.findOne({
        _id: _id
    }, (err, receipt) => {
        if (err)
            return next(err);
        receipt.house = houseId;
        receipt.referenceNo = referenceNo;
        receipt.amount = amount;
        receipt.attachment = attachment;
        receipt.filename = filename;
        receipt.issuedDate = issuedDate;
        receipt.updatedDate = new Date();
        receipt.updatedBy = verified.username;
        receipt.save();
        res.json(receipt);
    });
});
exports.api.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    var _id = req.params.id;
    receipt_1.collection.deleteOne({
        _id: _id
    })
        .exec((err, deleted) => {
        House_1.House.find({
            'receipts': _id
        })
            .exec((err, houses) => {
            (houses || []).forEach((h) => {
                h.receipts = h.receipts.filter((p) => p.toString() != _id) || [];
                h.save();
            });
            res.json(_id);
        });
    });
});
exports.api.get('/download/:id', function (req, res, next) {
    var _id = req.params.id;
    receipt_1.collection.findOne({
        _id: _id
    })
        .exec((err, receipt) => {
        if (err)
            return next(err);
        let base64 = (receipt.attachment || '').split(';base64,').pop();
        const file = Buffer.from(base64, 'base64');
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment;filename=${receipt.filename}`);
        res.setHeader('Content-Length', file.length);
        res.write(file, 'binary');
        res.end();
    });
});
//# sourceMappingURL=receipts.js.map