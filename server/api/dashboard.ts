import * as passport from 'passport';
import * as express from 'express';
import { Bill } from './../models/Bill';
import { Payment } from './../models/Payment';
import { House } from './../models/House';
import { forkJoin, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { helper } from './../helper';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/database';

export const api = express();

api.get('/owner', passport.authenticate('jwt', { session: false }),
  (req, res, next) => {

    const token = helper.getToken(req.headers);
    const verified = jwt.verify(token, config.secret);

    House.find({ users: { $in: [verified._id] } },
      (err, houses) => {
        if (err) return next(err);

        forkJoin([
          Bill.find({ house: { $in: houses } }),
          Payment.find({ house: { $in: houses } }),
        ])
          .pipe(
            catchError((error: any) => {
              console.log(error);
              return throwError(error);
            })
          )
          .subscribe(results => {
            const bills = results[0] || [];
            const payments = results[1] || [];

            const outstanding = (bills as any[]).map(x => x.amount || 0).reduce((a, b) => a + b, 0);
            const paid = (payments as any[]).map(x => x.amount || 0).reduce((a, b) => a + b, 0);
            const sorted = (payments as any[]).sort((a, b) => {
              return b.paidDate - a.paidDate;
            }) || [];

            res.json({
              outstanding: outstanding,
              paid: paid,
              lastPaidDate: (sorted[0] || null)?.paidDate,
            });
          });

      });
  });

