import * as passport from 'passport';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { helper } from './../helper';
import { config } from './../config/database';
import { House } from './../models/House';
import { User } from './../models/User';
import { passwordConfig } from './../config/passport';

passwordConfig(passport);

export const api = express();

api.delete('/:id', passport.authenticate('jwt', {
  session: false
}), function (req: express.Request, res: express.Response, next) {
  var _id = req.params.id;
  House.deleteOne({
    _id: _id
  }).exec(deleted => {
    res.json(_id);
  });
});

api.get('/', (req: express.Request, res: express.Response, next) => {  
  House.find({})
    .populate('bills')
    .populate('users')
    .populate('payments')
    .populate('vehicles')
    .exec((err, houses) => {
      if (err) return next(err);
      res.json(houses || []);
    });
});

api.get('/owner', passport.authenticate('jwt', {
  session: false
}),
(req: express.Request, res: express.Response, next) => {
    const token = helper.getToken(req.headers);
    const verified: any = jwt.verify(token, config.secret);

    User.findOne({
      _id: verified._id
    })
      .populate('roles')
      .exec((err, user: any) => {

        // check if user is owner
        const found = (user.roles || []).filter((x: any) => {
          return x.name == 'owner';
        }) || [];

        if (found.length > 0) return next();

        res.json([]);
      });
  },
  (req, res, next) => {
    const token = helper.getToken(req.headers);
    const verified: any = jwt.verify(token, config.secret);

    House.find({
      'users': verified._id
    })
      .populate('bills')
      .populate('users')
      .populate('payments')
      .populate('vehicles')
      .exec((err, houses) => {
        if (err) return next(err);
        res.json(houses || []);
      });
  });

api.get('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {
  var id = req.params.id;
  House.findOne({
    _id: id
  })
    .populate('bills')
    .populate('users')
    .populate('payments')
    .populate('vehicles')
    .exec(function (err, house) {
      if (err) return next(err);
      res.json(house);
    });
});

api.post('/', passport.authenticate('jwt', {
  session: false
}), (req: express.Request, res: express.Response, next) => {
  var {
    _id,
    street,
    unit,
    users,
    bills,
    payments
  } = req.body;
  House.insertMany([{
    street: street,
    unit: unit,
    users: users,
    bills: bills,
    payments: payments
  }], (err, house) => {
    if (err) return next(err);
    res.json(house);
  });
});

api.put('/', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {

  var {
    _id,
    street,
    unit,
    bills,
    users,
    payments
  } = req.body;

  House.update({
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
    if (err) return next(err);

    res.json(modified);
  });
});
