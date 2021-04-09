"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const Role_1 = require("./../models/Role");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Role_1.Role.find(function (err, users) {
        if (err)
            return next(err);
        res.json(users);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    var id = req.params.id;
    Role_1.Role.findOne({ _id: id })
        .exec(function (err, role) {
        if (err)
            return next(err);
        res.json(role);
    });
});
exports.api.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    var { _id, name } = req.body;
    Role_1.Role.findOne({ _id: _id })
        .exec((err, role) => {
        if (err)
            return next(err);
        role.name = name;
        role.save();
        res.json(role);
    });
});
exports.api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { _id, name } = req.body;
    const role = new Role_1.Role();
    role.name = name;
    role.save();
    res.json(role);
});
exports.api.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
    var _id = req.params.id;
    Role_1.Role.deleteOne({ _id: _id }).exec();
});
//# sourceMappingURL=roles copy.js.map