import { Observable } from 'rxjs';
import { IDocument } from '../interfaces/i-document';

export abstract class DocumentService {
  documentsUrl = 'http://localhost:8083/api/documents';  // URL to web api

  abstract getDocuments(): Observable<IDocument[]>;
  abstract getDocument(id: string): Observable<IDocument>;
  abstract addDocument(document: IDocument): Observable<IDocument>;
  abstract deleteDocument(document: IDocument | string): Observable<IDocument>;
  abstract updateDocument(document: IDocument): Observable<IDocument>;
}
