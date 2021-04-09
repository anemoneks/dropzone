import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { BillService } from './bill.service';
import { IBill } from '../interfaces/i-bill';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientBillService extends BillService {

  constructor(private http: HttpClient) {
    super();
  }

  getBills(): Observable<IBill[]> {
    return this.http.get<IBill[]>(this.billsUrl, cudOptions).pipe(
      // tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  getOwnerBills(): Observable<IBill[]> {
    return this.http.get<IBill[]>(this.billsUrl + '/owner', cudOptions).pipe(
      // tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  // This get-by-id will 404 when id not found
  getBill(id: string): Observable<IBill> {
    const url = `${this.billsUrl}/${id}`;
    return this.http.get<IBill>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getBill<Data>(id: number): Observable<Bill> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<Bill[]>(url)
  //     .map(heroes => heroes[0] as Bill)
  //     .catch(this.handleError);
  // }

  addBill(bill: IBill): Observable<IBill> {
    return this.http.post<IBill>(this.billsUrl, bill, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteBill(bill: IBill | string): Observable<IBill> {
    const id = typeof bill === 'string' ? bill : bill._id;
    const url = `${this.billsUrl}/${id}`;
    return this.http.delete<IBill>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  searchBills(term: string): Observable<IBill[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<IBill[]>(this.billsUrl, options).pipe(
      catchError(this.handleError)
    );
  }

  updateBill(bill: IBill): Observable<null | IBill> {
    return this.http.put<IBill>(this.billsUrl, bill, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for bill consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
