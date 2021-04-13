import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { MessageService } from './message.service';
import { IMessage } from '../interfaces/i-message';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientMessageService extends MessageService {

  constructor(private http: HttpClient) {
    super();
  }

  getMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.messagesUrl, cudOptions)
      .pipe(
        // tap(data => console.log(data)), // eyeball results in the console
        catchError(this.handleError)
      );
  }

  // This get-by-id will 404 when id not found
  getMessage(id: string): Observable<IMessage> {
    const url = `${this.messagesUrl}/${id}`;
    return this.http.get<IMessage>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getMessage<Data>(id: number): Observable<Message> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<Message[]>(url)
  //     .map(heroes => heroes[0] as Message)
  //     .catch(this.handleError);
  // }

  addMessage(message: IMessage): Observable<IMessage> {
    return this.http.post<IMessage>(this.messagesUrl, message, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteMessage(message: IMessage | string): Observable<IMessage> {
    const id = typeof message === 'string' ? message : message._id;
    const url = `${this.messagesUrl}/${id}`;

    return this.http.delete<IMessage>(url, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateMessage(hero: IMessage): Observable<null | IMessage> {
    return this.http.put<IMessage>(this.messagesUrl, hero, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for message consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
