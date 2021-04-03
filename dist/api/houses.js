"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const jwt = require("jsonwebtoken");
const helper_1 = require("./../helper");
const database_1 = require("./../config/database");
const House_1 = require("./../models/House");
const User_1 = require("./../models/User");
const passport_1 = require("./../config/passport");
passport_1.passwordConfig(passport);
exports.api = express();
exports.api.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res, next) {
    var _id = req.params.id;
    House_1.House.deleteOne({
        _id: _id
    }).exec(deleted => {
        res.json(_id);
    });
});
exports.api.get('/', (req, res, next) => {
    console.log(passport.authenticate('jwt', {
        session: false
    }));
    House_1.House.find({})
        .populate('bills')
        .populate('users')
        .populate('payments')
        .populate('vehicles')
        .exec((err, houses) => {
        console.log(err);
        if (err)
            return next(err);
        res.json(houses || []);
    });
});
exports.api.get('/owner', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    User_1.User.findOne({
        _id: verified._id
    })
        .populate('roles')
        .exec((err, user) => {
        // check if user is owner
        const found = (user.roles || []).filter((x) => {
            return x.name == 'owner';
        }) || [];
        if (found.length > 0)
            return next();
        res.json([]);
    });
}, (req, res, next) => {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    House_1.House.find({
        'users': verified._id
    })
        .populate('bills')
        .populate('users')
        .populate('payments')
        .populate('vehicles')
        .exec((err, houses) => {
        if (err)
            return next(err);
        res.json(houses || []);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res, next) {
    var id = req.params.id;
    House_1.House.findOne({
        _id: id
    })
        .populate('bills')
        .populate('users')
        .populate('payments')
        .populate('vehicles')
        .exec(function (err, house) {
        if (err)
            return next(err);
        res.json(house);
    });
});
exports.api.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var { _id, street, unit, users, bills, payments } = req.body;
    House_1.House.insertMany([{
            street: street,
            unit: unit,
            users: users,
            bills: bills,
            payments: payments
        }], (err, house) => {
        if (err)
            return next(err);
        res.json(house);
    });
});
exports.api.put('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var { _id, street, unit, bills, users, payments } = req.body;
    House_1.House.update({
        _id: _id
    }, {
        $set: {
            unit: unit,
            street: street,
            bills: bills,
            users: users,
            payments: payments,
        }
    }, (err, modified) => {
        if (err)
            return next(err);
        res.json(modified);
    });
});
//# sourceMappingURL=houses.js.map