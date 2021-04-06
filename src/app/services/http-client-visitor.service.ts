import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { VisitorService } from './visitor.service';
import { IVisitor } from '../interfaces/i-visitor';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})

export class HttpClientVisitorService extends VisitorService {

  constructor(private http: HttpClient) {
    super();
  }

  getVisitors(): Observable<IVisitor[]> {
    return this.http.get<IVisitor[]>(this.visitorsUrl, cudOptions).pipe(
      // tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  getOwnerVisitors(): Observable<IVisitor[]> {
    const url = `${this.visitorsUrl}/owner`;
    return this.http.get<IVisitor[]>(url, cudOptions).pipe(
      // tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  // This get-by-id will 404 when id not found
  getVisitor(id: string): Observable<IVisitor> {
    const url = `${this.visitorsUrl}/${id}`;
    return this.http.get<IVisitor>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getVisitor<Data>(id: number): Observable<Visitor> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<Visitor[]>(url)
  //     .map(heroes => heroes[0] as Visitor)
  //     .catch(this.handleError);
  // }

  addVisitor(visitor: IVisitor): Observable<IVisitor> {
    return this.http.post<IVisitor>(this.visitorsUrl, visitor, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteVisitor(visitor: IVisitor | string): Observable<IVisitor> {
    const _id = typeof visitor === 'string' ? visitor : visitor._id;
    const url = `${this.visitorsUrl}/${_id}`;

    return this.http.delete<IVisitor>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  searchVisitors(term: string): Observable<IVisitor[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<IVisitor[]>(this.visitorsUrl, options).pipe(
      catchError(this.handleError)
    );
  }

  updateVisitor(visitor: IVisitor): Observable<null | IVisitor> {
    return this.http.put<IVisitor>(this.visitorsUrl, visitor, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for visitor consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
