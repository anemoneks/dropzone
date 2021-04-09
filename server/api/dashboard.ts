import * as passport from 'passport';
import * as express from 'express';
import { Bill } from './../models/Bill';
import { forkJoin, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const api = express();

api.get('/owner', passport.authenticate('jwt', { session: false }),
  (req, res, next) => {

    forkJoin([
      Bill.find({})
    ])
      .pipe(
        catchError((error: any) => {
          console.log(error);
          return throwError(error);
        })
      )
      .subscribe(results => {
        const bills = results[0];

        const outstanding = ((bills as any[]) || []).map(x => x.amount || 0).reduce((a, b) => a + b, 0);

        res.json({
          outstanding: outstanding,
        });
      });
  });

