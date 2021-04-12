import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { DocumentService } from './document.service';
import { IDocument } from '../interfaces/i-document';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientDocumentService extends DocumentService {

  constructor(private http: HttpClient) {
    super();
  }

  getDocuments(): Observable<IDocument[]> {
    return this.http.get<IDocument[]>(this.documentsUrl, cudOptions)
      .pipe(
        // tap(data => console.log(data)), // eyeball results in the console
        catchError(this.handleError)
      );
  }

  // This get-by-id will 404 when id not found
  getDocument(id: string): Observable<IDocument> {
    const url = `${this.documentsUrl}/${id}`;
    return this.http.get<IDocument>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getDocument<Data>(id: number): Observable<Document> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<Document[]>(url)
  //     .map(heroes => heroes[0] as Document)
  //     .catch(this.handleError);
  // }

  addDocument(document: IDocument): Observable<IDocument> {
    return this.http.post<IDocument>(this.documentsUrl, document, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteDocument(document: IDocument | string): Observable<IDocument> {
    const id = typeof document === 'string' ? document : document._id;
    const url = `${this.documentsUrl}/${id}`;

    return this.http.delete<IDocument>(url, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateDocument(hero: IDocument): Observable<null | IDocument> {
    return this.http.put<IDocument>(this.documentsUrl, hero, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for document consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
