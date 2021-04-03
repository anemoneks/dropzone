import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { PaymentService } from './payment.service';
import { IPayment } from '../interfaces/i-payment';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientPaymentService extends PaymentService {

  constructor(private http: HttpClient) {
    super();
  }

  getPayments(): Observable<IPayment[]> {
    return this.http.get<IPayment[]>(this.paymentsUrl, cudOptions).pipe(
      // tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  // This get-by-id will 404 when id not found
  getPayment(id: string): Observable<IPayment> {
    const url = `${this.paymentsUrl}/${id}`;
    return this.http.get<IPayment>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getPayment<Data>(id: number): Observable<Payment> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<Payment[]>(url)
  //     .map(heroes => heroes[0] as Payment)
  //     .catch(this.handleError);
  // }

  addPayment(payment: IPayment): Observable<IPayment> {
    return this.http.post<IPayment>(this.paymentsUrl, payment, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  deletePayment(payment: IPayment | string): Observable<IPayment> {
    const id = typeof payment === 'string' ? payment : payment._id;
    const url = `${this.paymentsUrl}/${id}`;
    return this.http.delete<IPayment>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  searchPayments(term: string): Observable<IPayment[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<IPayment[]>(this.paymentsUrl, options).pipe(
      catchError(this.handleError)
    );
  }

  updatePayment(payment: IPayment): Observable<null | IPayment> {
    return this.http.put<IPayment>(this.paymentsUrl, payment, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for payment consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
