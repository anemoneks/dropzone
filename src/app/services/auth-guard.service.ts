import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.jwtService.loggedIn) {
      return true;
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: state.url
        }
      });
      return false;
    }
  }
}