"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const passport = require("passport");
const express = require("express");
const document_1 = require("./../models/document");
const jwt = require("jsonwebtoken");
const helper_1 = require("./../helper");
const database_1 = require("./../config/database");
exports.api = express();
exports.api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    document_1.Document.find((err, documents) => {
        if (err)
            return next(err);
        res.json(documents);
    });
});
exports.api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    var id = req.params.id;
    document_1.Document.findOne({ _id: id })
        .exec((err, document) => {
        if (err)
            return next(err);
        res.json(document);
    });
});
exports.api.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    const { _id, title, filename, attachment, documentType, releasedDate } = req.body;
    document_1.Document.insertMany([{
            title: title,
            filename: filename,
            attachment: attachment,
            documentType: documentType,
            releasedDate: releasedDate,
            createdBy: verified._id,
            createdDate: new Date(),
            updatedBy: verified._id,
            updatedDate: new Date(),
        }], (err, document) => {
        if (err)
            return next(err);
        res.json(document);
    });
});
exports.api.put('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const token = helper_1.helper.getToken(req.headers);
    const verified = jwt.verify(token, database_1.config.secret);
    const { _id, title, filename, attachment, documentType, releasedDate } = req.body;
    document_1.Document.findOne({
        _id: _id
    }, (err, document) => {
        if (err)
            return next(err);
        document.title = title;
        document.filename = filename;
        document.attachment = attachment;
        document.documentType = documentType;
        document.releasedDate = releasedDate;
        document.updatedDate = new Date();
        document.updatedBy = verified._id;
        document.save();
        res.json(document);
    });
});
exports.api.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    var _id = req.params.id;
    document_1.Document.deleteOne({
        _id: _id
    })
        .exec((err, deleted) => {
        res.json(deleted);
    });
});
//# sourceMappingURL=message.js.map