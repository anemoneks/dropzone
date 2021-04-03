import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { RoleService } from './role.service';
import { IRole } from '../interfaces/i-role';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientRoleService extends RoleService {

  constructor(private http: HttpClient) {
    super();
  }

  getRoles(): Observable<IRole[]> {
    return this.http.get<IRole[]>(this.rolesUrl, cudOptions)
      .pipe(
        // tap(data => console.log(data)), // eyeball results in the console
        catchError(this.handleError)
      );
  }

  // This get-by-id will 404 when id not found
  getRole(id: string): Observable<IRole> {
    const url = `${this.rolesUrl}/${id}`;
    return this.http.get<IRole>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getRole<Data>(id: number): Observable<Role> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<Role[]>(url)
  //     .map(heroes => heroes[0] as Role)
  //     .catch(this.handleError);
  // }

  addRole(role: IRole): Observable<IRole> {
    return this.http.post<IRole>(this.rolesUrl, role, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteRole(role: IRole | string): Observable<IRole> {
    const id = typeof role === 'string' ? role : role._id;
    const url = `${this.rolesUrl}/${id}`;

    return this.http.delete<IRole>(url, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateRole(hero: IRole): Observable<null | IRole> {
    return this.http.put<IRole>(this.rolesUrl, hero, cudOptions)
      .pipe(
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
