import { Observable } from 'rxjs';
import { IReceipt } from '../interfaces/i-receipt';

export abstract class ReceiptService {
  receiptsUrl = 'http://localhost:8083/api/receipts';  // URL to web api

  abstract getReceipts(): Observable<IReceipt[]>;
  abstract getReceipt(id: string): Observable<IReceipt>;
  abstract addReceipt(receipt: IReceipt): Observable<IReceipt>;
  abstract deleteReceipt(receipt: IReceipt | string): Observable<IReceipt>;
  abstract searchReceipts(term: string): Observable<IReceipt[]>;
  abstract updateReceipt(receipt: IReceipt): Observable<IReceipt>;
}
