import * as passport from 'passport';
import * as express from 'express';
import { Document } from './../models/document';

export const api = express();

api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Document.find(function (err, documents) {
    if (err) return next(err);
    res.json(documents);
  });
});

api.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var id = req.params.id;
  Document.findOne({ _id: id })
    .exec(function (err, document) {
      if (err) return next(err);
      res.json(document);
    });
});
