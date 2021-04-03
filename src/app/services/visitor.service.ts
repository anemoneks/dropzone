import { Observable } from 'rxjs';
import { IVisitor } from '../interfaces/i-visitor';
import { IBill } from '../interfaces/i-bill';

export abstract class VisitorService {
  visitorsUrl = 'http://localhost:8083/api/visitors';  // URL to web api

  abstract getVisitors(): Observable<IVisitor[]>;
  abstract getVisitor(id: string): Observable<IVisitor>;
  abstract addVisitor(visitor: IVisitor): Observable<IVisitor>;
  abstract deleteVisitor(visitor: IVisitor | string): Observable<IVisitor>;
  abstract searchVisitors(term: string): Observable<IVisitor[]>;
  abstract updateVisitor(visitor: IVisitor): Observable<IVisitor>;
}
