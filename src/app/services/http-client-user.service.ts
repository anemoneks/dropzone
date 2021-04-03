import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { UserService } from './user.service';
import { IUser } from '../interfaces/i-user';
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
export class HttpClientUserService extends UserService {

  constructor(private http: HttpClient) {
    super();
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.usersUrl, cudOptions).pipe(
      // tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  // This get-by-id will 404 when id not found
  getUser(_id: string): Observable<IUser> {
    const url = `${this.usersUrl}/${_id}`;
    return this.http.get<IUser>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getUser<Data>(id: number): Observable<User> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<User[]>(url)
  //     .map(heroes => heroes[0] as User)
  //     .catch(this.handleError);
  // }

  addUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.usersUrl, user, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(user: IUser | string): Observable<IUser> {
    const id = typeof user === 'string' ? user : user._id;
    const url = `${this.usersUrl}/${id}`;

    return this.http.delete<IUser>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  searchUsers(term: string): Observable<IUser[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<IUser[]>(this.usersUrl, options).pipe(
      catchError(this.handleError)
    );
  }

  searchUsername(username: string): Observable<IUser[]> {
    username = (username || '').trim();
    return this.http.get<IUser[]>(`${this.usersUrl}/find/username/?username=${encodeURIComponent(username)}`, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  searchEmail(email: string): Observable<IUser[]> {
    email = (email || '').trim();
    return this.http.get<IUser[]>(`${this.usersUrl}/find/email/?email=${encodeURIComponent(email)}`, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  signIn(username: string, password: string): Observable<object> {
    return this.http.post<object>(this.usersUrl + '/signin', { username: username, password: password })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUser(user: IUser): Observable<null | IUser> {
    return this.http.put<IUser>(this.usersUrl, user, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for user consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
