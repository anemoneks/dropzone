import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  public get loggedIn(): boolean {
    return localStorage.getItem('jwtToken') !== null;
  }
}
