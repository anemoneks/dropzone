import * as passport from 'passport';
import * as express from 'express';
import { Document } from './../models/document';
import * as jwt from 'jsonwebtoken';
import { helper } from './../helper';
import { config } from './../config/database';

export const api = express();

api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Document.find((err, documents) => {
    if (err) return next(err);
    res.json(documents);
  });
});

api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var id = req.params.id;
  Document.findOne({ _id: id })
    .exec((err, document) => {
      if (err) return next(err);
      res.json(document);
    });
});

api.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {

  const token = helper.getToken(req.headers);
  const verified: any = jwt.verify(token, config.secret);

  const { _id, title, filename, attachment, documentType } = req.body;

  Document.insertMany([{
    title: title,
    filename: filename,
    attachment: attachment,
    documentType: documentType,
    createdBy: verified._id,
    createdDate: new Date(),
    updatedBy: verified._id,
    updatedDate: new Date(),
  }], (err, document) => {
    if (err) return next(err);
    res.json(document);
  });
});

api.put('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {

  const token = helper.getToken(req.headers);
  const verified: any = jwt.verify(token, config.secret);
  const { _id, title, filename, attachment, documentType } = req.body;

  Document.findOne({
    _id: _id
  }, (err, document: any) => {
    if (err) return next(err);
    document.title = title;
    document.filename = filename;
    document.attachment = attachment;
    document.documentType = documentType;
    document.save();
    res.json(document);
  });
});

api.delete('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _id = req.params.id;

  Document.deleteOne({
    _id: _id
  })
    .exec((err, deleted) => {
      res.json(deleted);
    });
});