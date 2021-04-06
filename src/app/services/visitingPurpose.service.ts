import { Observable } from 'rxjs';
import { IVisitingPurpose } from './../interfaces/i-visitingPurpose';

export abstract class VisitingPurposeService {
  visitingPurposesUrl = 'http://localhost:8083/api/visitingPurposes';  // URL to web api

  abstract getVisitingPurposes(): Observable<IVisitingPurpose[]>;
  abstract getVisitingPurpose(id: string): Observable<IVisitingPurpose>;
}
