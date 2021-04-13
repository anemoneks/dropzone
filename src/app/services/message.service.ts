import { Observable } from 'rxjs';
import { IMessage } from '../interfaces/i-message';

export abstract class MessageService {
  messagesUrl = 'http://localhost:8083/api/messages';  // URL to web api

  abstract getMessages(): Observable<IMessage[]>;
  abstract getMessage(id: string): Observable<IMessage>;
  abstract addMessage(message: IMessage): Observable<IMessage>;
  abstract deleteMessage(message: IMessage | string): Observable<IMessage>;
  abstract updateMessage(message: IMessage): Observable<IMessage>;
}
