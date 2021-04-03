import { Observable } from 'rxjs';
import { IBill } from '../interfaces/i-bill';

export abstract class BillService {
  billsUrl = 'http://localhost:8083/api/bills';  // URL to web api

  abstract getBills(): Observable<IBill[]>;
  abstract getBill(id: number): Observable<IBill>;
  abstract addBill(bill: IBill): Observable<IBill>;
  abstract deleteBill(bill: IBill | string): Observable<IBill>;
  abstract searchBills(term: string): Observable<IBill[]>;
  abstract updateBill(bill: IBill): Observable<IBill>;
}
