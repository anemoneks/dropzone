import * as passport from 'passport';
import * as express from 'express';
import { Visitor } from '../models/visitor';

export const api = express();

api.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Visitor.find({})
    .populate('house')
    .populate('race')
    .populate('vehicleType')
    .populate('visitingPurpose')
    .exec((err, visitors) => {
      if (err) return next(err);
      res.json(visitors);
    });;
});

api.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const { _id, firstName, lastName, gender, vehicleNo, raceId, vehicleTypeId, houseId, visitingPurposeId } = req.body;
  const visitor: any = new Visitor();
  visitor.firstName = firstName;
  visitor.lastName = lastName;
  visitor.vehicleNo = vehicleNo;
  visitor.gender = gender;
  visitor.race = raceId;
  visitor.vehicleType = vehicleTypeId;
  visitor.house = houseId;
  visitor.visitingPurpose = visitingPurposeId;
  visitor.visitedDate = new Date();
  visitor.save();
  res.json(visitor);
});

api.delete('/:id', passport.authenticate('jwt', {
  session: false
}), function (req: express.Request, res: express.Response, next) {
  var _id = req.params.id;
  Visitor.deleteOne({
    _id: _id
  }).exec(deleted => {
    res.json(_id);
  });
});