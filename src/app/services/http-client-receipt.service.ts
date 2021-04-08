import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { ReceiptService } from './receipt.service';
import { IReceipt } from '../interfaces/i-receipt';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientReceiptService extends ReceiptService {

  constructor(private http: HttpClient) {
    super();
  }

  getReceipts(): Observable<IReceipt[]> {
    return this.http.get<IReceipt[]>(this.receiptsUrl, cudOptions).pipe(
      // tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  // This get-by-id will 404 when id not found
  getReceipt(id: string): Observable<IReceipt> {
    const url = `${this.receiptsUrl}/${id}`;
    return this.http.get<IReceipt>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getReceipt<Data>(id: number): Observable<Receipt> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<Receipt[]>(url)
  //     .map(heroes => heroes[0] as Receipt)
  //     .catch(this.handleError);
  // }

  addReceipt(receipt: IReceipt): Observable<IReceipt> {
    return this.http.post<IReceipt>(this.receiptsUrl, receipt, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteReceipt(receipt: IReceipt | string): Observable<IReceipt> {
    const id = typeof receipt === 'string' ? receipt : receipt._id;
    const url = `${this.receiptsUrl}/${id}`;
    return this.http.delete<IReceipt>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  searchReceipts(term: string): Observable<IReceipt[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<IReceipt[]>(this.receiptsUrl, options).pipe(
      catchError(this.handleError)
    );
  }

  updateReceipt(receipt: IReceipt): Observable<null | IReceipt> {
    return this.http.put<IReceipt>(this.receiptsUrl, receipt, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for receipt consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
