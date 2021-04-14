"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const jwt = require("jsonwebtoken");
const helper_1 = require("./../helper");
const database_1 = require("./../config/database");
const message_1 = require("./../models/message");
const House_1 = require("./../models/House");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    message_1.collection.find({})
        .populate('house')
        .populate('createdBy')
        .exec(function (err, messages) {
        if (err)
            return next(err);
        console.log(messages);
        res.json(messages);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let _id = req.params.id;
    message_1.collection.findOne({
        _id: _id,
    }).populate('house')
        .exec(function (err, message) {
        if (err)
            return next(err);
        res.json(message);
    });
});
exports.api.post('/', passport.authenticate('jwt', {
    session: false
}), function (req, res, next) {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    const { _id, allHouses, houses, subject, body, unread, } = req.body;
    if (allHouses) {
        House_1.House.find({})
            .exec((err, _houses) => {
            message_1.collection.insertMany([{
                    allHouses: allHouses || false,
                    houses: _houses.map(x => x._id) || [],
                    subject: subject,
                    body: body,
                    unread: unread !== null && unread !== void 0 ? unread : false,
                    createdBy: verified._id,
                    createdDate: new Date(),
                    updatedBy: verified._id,
                    updatedDate: new Date(),
                }], (err, message) => {
                if (err)
                    return next(err);
                res.json(message);
            });
        });
    }
    else {
        message_1.collection.insertMany([{
                allHouses: allHouses || false,
                houses: houses.map(x => x._id) || [],
                subject: subject,
                body: body,
                unread: unread !== null && unread !== void 0 ? unread : false,
                createdBy: verified._id,
                createdDate: new Date(),
                updatedBy: verified._id,
                updatedDate: new Date(),
            }], (err, message) => {
            if (err)
                return next(err);
            res.json(message);
        });
    }
});
exports.api.put('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    const { _id, house, subject, body, unread } = req.body;
    message_1.collection.findOne({
        _id: _id
    }, (err, message) => {
        if (err)
            return next(err);
        message.subject = subject;
        message.body = body;
        message.unread = unread;
        message.save();
        res.json(message);
    });
});
exports.api.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    var _id = req.params.id;
    message_1.collection.deleteOne({
        _id: _id
    })
        .exec((err, deleted) => {
        if (err)
            return err;
        res.json(deleted);
    });
});
//# sourceMappingURL=messages.js.map