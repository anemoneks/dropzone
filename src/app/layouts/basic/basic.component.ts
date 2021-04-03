import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HttpClientUserService } from './../../services/http-client-user.service';

declare var $: any;

@Component({
  selector: 'app-basic-layout',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit {

  public config: PerfectScrollbarConfigInterface = {};

  constructor(
    private HttpClientUserService: HttpClientUserService,
    public router: Router
  ) { }

  public innerWidth: any;
  public defaultSidebar: any;
  public showMobileMenu = false;
  public expandLogo = false;
  public sidebartype = 'full';

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['/starter']);
    }
    this.defaultSidebar = this.sidebartype;
    this.handleSidebar();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.sidebartype = 'mini-sidebar';
    } else {
      this.sidebartype = this.defaultSidebar;
    }
  }

  toggleSidebarType() {
    switch (this.sidebartype) {
      case 'full':
        this.sidebartype = 'mini-sidebar';
        break;

      case 'mini-sidebar':
        this.sidebartype = 'full';
        break;

      default:
    }
  }
}
