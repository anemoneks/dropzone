import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { HouseService } from './house.service';
import { IHouse } from '../interfaces/i-house';
import { IDocument } from '../interfaces/i-document';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})

export class HttpClientHouseService extends HouseService {

  constructor(private http: HttpClient) {
    super();
  }

  getHouses(): Observable<IHouse[]> {
    return this.http.get<IHouse[]>(this.housesUrl, cudOptions).pipe(
      // tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  getOwnerHouses(): Observable<IHouse[]> {
    const url = `${this.housesUrl}/owner`;
    return this.http.get<IHouse[]>(url, cudOptions).pipe(
      // tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  // This get-by-id will 404 when id not found
  getHouse(id: string): Observable<IHouse> {
    const url = `${this.housesUrl}/${id}`;
    return this.http.get<IHouse>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getHouse<Data>(id: number): Observable<House> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<House[]>(url)
  //     .map(heroes => heroes[0] as House)
  //     .catch(this.handleError);
  // }

  addHouse(house: IHouse): Observable<IHouse> {
    return this.http.post<IHouse>(this.housesUrl, house, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteHouse(house: IHouse | string): Observable<IHouse> {
    const _id = typeof house === 'string' ? house : house._id;
    const url = `${this.housesUrl}/${_id}`;

    return this.http.delete<IHouse>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  searchHouses(term: string): Observable<IHouse[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<IHouse[]>(this.housesUrl, options).pipe(
      catchError(this.handleError)
    );
  }

  updateHouse(house: IHouse): Observable<null | IHouse> {
    return this.http.put<IHouse>(this.housesUrl, house, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  addDocuments(documents: IDocument[]): Observable<null | IHouse> {
    return this.http.put<IHouse>(this.housesUrl + '/documents', documents, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for house consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
