import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { RaceService } from './race.service';
import { IRace } from '../interfaces/i-race';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientRaceService extends RaceService {

  constructor(private http: HttpClient) {
    super();
  }

  getRaces(): Observable<IRace[]> {
    return this.http.get<IRace[]>(this.racesUrl, cudOptions)
      .pipe(
        // tap(data => console.log(data)), // eyeball results in the console
        catchError(this.handleError)
      );
  }

  // This get-by-id will 404 when id not found
  getRace(id: string): Observable<IRace> {
    const url = `${this.racesUrl}/${id}`;
    return this.http.get<IRace>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getRace<Data>(id: number): Observable<Race> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<Race[]>(url)
  //     .map(heroes => heroes[0] as Race)
  //     .catch(this.handleError);
  // }

  addRace(race: IRace): Observable<IRace> {
    return this.http.post<IRace>(this.racesUrl, race, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteRace(race: IRace | string): Observable<IRace> {
    const id = typeof race === 'string' ? race : race._id;
    const url = `${this.racesUrl}/${id}`;

    return this.http.delete<IRace>(url, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateRace(hero: IRace): Observable<null | IRace> {
    return this.http.put<IRace>(this.racesUrl, hero, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for race consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
