import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { DashboardService } from './dashboard.service';
import { IDashboard } from '../interfaces/i-dashboard';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientDashboardService extends DashboardService {

  constructor(private http: HttpClient) {
    super();
  }

  getDashboard(): Observable<IDashboard[]> {
    return this.http.get<IDashboard[]>(this.dashboardUrl + '/owner', cudOptions)
      .pipe(
        // tap(data => console.log(data)), // eyeball results in the console
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for role consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
