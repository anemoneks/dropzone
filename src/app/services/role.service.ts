import { Observable } from 'rxjs';
import { IRole } from '../interfaces/i-role';

export abstract class RoleService {
  rolesUrl = 'http://localhost:8083/api/roles';  // URL to web api

  abstract getRoles(): Observable<IRole[]>;
  abstract getRole(id: string): Observable<IRole>;
  abstract addRole(role: IRole): Observable<IRole>;
  abstract deleteRole(role: IRole | string): Observable<IRole>;
  abstract updateRole(role: IRole): Observable<IRole>;
}
