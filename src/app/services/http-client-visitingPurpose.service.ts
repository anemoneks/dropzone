import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { VisitingPurposeService } from './visitingPurpose.service';
import { IVisitingPurpose } from '../interfaces/i-visitingPurpose';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientVisitingPurposeService extends VisitingPurposeService {

  constructor(private http: HttpClient) {
    super();
  }

  getVisitingPurposes(): Observable<IVisitingPurpose[]> {
    return this.http.get<IVisitingPurpose[]>(this.visitingPurposesUrl, cudOptions)
      .pipe(
        // tap(data => console.log(data)), // eyeball results in the console
        catchError(this.handleError)
      );
  }

  // This get-by-id will 404 when id not found
  getVisitingPurpose(id: string): Observable<IVisitingPurpose> {
    const url = `${this.visitingPurposesUrl}/${id}`;
    return this.http.get<IVisitingPurpose>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getVisitingPurpose<Data>(id: number): Observable<VisitingPurpose> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<VisitingPurpose[]>(url)
  //     .map(heroes => heroes[0] as VisitingPurpose)
  //     .catch(this.handleError);
  // }

  addVisitingPurpose(visitingPurpose: IVisitingPurpose): Observable<IVisitingPurpose> {
    return this.http.post<IVisitingPurpose>(this.visitingPurposesUrl, visitingPurpose, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteVisitingPurpose(visitingPurpose: IVisitingPurpose | string): Observable<IVisitingPurpose> {
    const id = typeof visitingPurpose === 'string' ? visitingPurpose : visitingPurpose._id;
    const url = `${this.visitingPurposesUrl}/${id}`;

    return this.http.delete<IVisitingPurpose>(url, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateVisitingPurpose(hero: IVisitingPurpose): Observable<null | IVisitingPurpose> {
    return this.http.put<IVisitingPurpose>(this.visitingPurposesUrl, hero, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for visitingPurpose consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
