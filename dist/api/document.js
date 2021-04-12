"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const document_1 = require("./../models/document");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    document_1.Document.find(function (err, documents) {
        if (err)
            return next(err);
        res.json(documents);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    var id = req.params.id;
    document_1.Document.findOne({ _id: id })
        .exec(function (err, document) {
        if (err)
            return next(err);
        res.json(document);
    });
});
//# sourceMappingURL=document.js.map