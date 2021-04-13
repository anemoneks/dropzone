"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const jwt = require("jsonwebtoken");
const database_1 = require("../config/database");
const User_1 = require("./../models/User");
const helper_1 = require("./../helper");
exports.api = express();
exports.api.get('/current', function (req, res) {
    var token = helper_1.helper.getToken(req.headers);
    var verified = jwt.verify(token, database_1.config.secret);
    User_1.User.find({
        _id: verified._id
    })
        .populate('roles')
        .exec((err, users) => {
    });
    res.json({
        success: true,
        user: verified
    });
});
exports.api.post('/signin', (req, res, next) => {
    User_1.User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err)
            throw err;
        if (!user) {
            res.status(401).send({
                success: false,
                msg: 'Authentication failed. User not found.'
            });
        }
        else {
            // check if password matches
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), database_1.config.secret);
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        token: 'JWT ' + token,
                        user: user
                    });
                }
                else {
                    res.status(401).send({
                        success: false,
                        msg: 'Authentication failed. Wrong password.'
                    });
                }
            });
        }
    });
});
exports.api.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const { _id, firstName, lastName, email, username, password } = req.body;
    const user = new User_1.User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        roles: [],
    });
    user.save();
    res.json(user);
});
exports.api.get('/find/username', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const { username } = req.query;
    User_1.User.find({
        username: username
    }, (err, users) => {
        if (err)
            return next(err);
        res.json(users);
    });
});
exports.api.get('/find/email', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const { email } = req.query;
    User_1.User.find({
        email: email
    }, (err, users) => {
        if (err)
            return next(err);
        res.json(users);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let _id = req.params.id;
    User_1.User.find({
        _id: _id
    }, (err, users) => {
        if (err)
            return next(err);
        res.json(users);
    });
});
exports.api.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var _id = req.params.id;
    var _id = req.params.id;
    User_1.User.deleteOne({
        _id: _id
    }, function (err, user) {
        if (err)
            return next(err);
        res.json(_id);
    });
});
exports.api.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    User_1.User.find((err, users) => {
        if (err)
            return next(err);
        res.json(users);
    });
});
exports.api.put('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var { _id, firstName, lastName, email, username, password, roles, avatar } = req.body;
    User_1.User.findOne({
        _id: _id
    }, (err, user) => {
        if (err)
            return next(err);
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.username = username;
        if ((password || '').trim() != '')
            user.password = password;
        user.roles = roles;
        user.avatar = avatar;
        user.save();
        res.json(user);
    });
});
//# sourceMappingURL=users.js.map