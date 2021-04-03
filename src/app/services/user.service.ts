import { Observable } from 'rxjs';
import { IUser } from '../interfaces/i-user';

export abstract class UserService {
  usersUrl = 'http://localhost:8083/api/users';  // URL to web api

  abstract getUsers(): Observable<IUser[]>;
  abstract getUser(_id: string): Observable<IUser>;
  abstract addUser(user: IUser): Observable<IUser>;
  abstract deleteUser(user: IUser | string): Observable<IUser>;
  abstract searchUsers(term: string): Observable<IUser[]>;
  abstract signIn(username: string, password: string): Observable<object>;
  abstract searchEmail(email: string): Observable<IUser[]>;
  abstract updateUser(user: IUser): Observable<IUser>;
  abstract searchUsername(username: string): Observable<IUser[]>;
}
