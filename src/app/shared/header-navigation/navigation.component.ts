import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
  @Output()
  toggleSidebar = new EventEmitter<void>();

  public showSearch = false;

  constructor(private router: Router) { }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }
}
