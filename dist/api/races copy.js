"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const documentType_1 = require("./../models/documentType");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    documentType_1.DocumentType.find(function (err, documentTypes) {
        if (err)
            return next(err);
        res.json(documentTypes);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    var id = req.params.id;
    documentType_1.DocumentType.findOne({ _id: id })
        .exec(function (err, documentType) {
        if (err)
            return next(err);
        res.json(documentType);
    });
});
//# sourceMappingURL=races copy.js.map