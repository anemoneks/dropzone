import { Observable } from 'rxjs';
import { IPayment } from '../interfaces/i-payment';

export abstract class PaymentService {
  paymentsUrl = 'http://localhost:8083/api/payments';  // URL to web api

  abstract getPayments(): Observable<IPayment[]>;
  abstract getPayment(id: string): Observable<IPayment>;
  abstract addPayment(payment: IPayment): Observable<IPayment>;
  abstract deletePayment(payment: IPayment | string): Observable<IPayment>;
  abstract searchPayments(term: string): Observable<IPayment[]>;
  abstract updatePayment(payment: IPayment): Observable<IPayment>;
}
