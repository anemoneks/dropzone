import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientUserService } from './../services/http-client-user.service';
import { Login } from './../models/login';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.formBuilder.group(new Login());;;
  returnUrl: string = '/';
  @ViewChild('content3') content3;

  f(): FormGroup {
    return this.loginForm;
  };

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private HttpClientUserService: HttpClientUserService) { }

  ngOnInit(): void {
    // Get the query params
    this.route.queryParams
      .subscribe(params => this.returnUrl = (params['returnUrl'] || '').trim() == '' ? '/' : '');

    let username = localStorage.getItem('username') || '';
    let password = localStorage.getItem('password') || '';

    this.loginForm.controls.username.setValue(username);
    this.loginForm.controls.password.setValue(password);
    this.loginForm.controls.rememberPassword.setValue(username != '');

    this.loginForm.controls.username.setValidators(Validators.required);
    this.loginForm.controls.password.setValidators(Validators.required);
  }

  openSm(content3) {
    this.modalService.open(content3, { size: 'sm' });
  }

  login(): void {
    let username: string = (this.loginForm.get('username').value || '').trim();
    let password: string = (this.loginForm.get('password').value || '').trim();
    let remmeberPassword: boolean = this.loginForm.get('rememberPassword').value || false;

    if (this.loginForm.valid) {

      this.HttpClientUserService.signIn(username, password)
        .subscribe(x => {
          if ((x['success'] as boolean)) {
            let token = (x['token'] as string);
            localStorage.setItem('jwtToken', token);

            // save password
            if (remmeberPassword) {
              localStorage.setItem('username', username);
              localStorage.setItem('password', password);
            }
            else {
              localStorage.removeItem('username');
              localStorage.removeItem('password');
            }
            
            this.route.queryParams.subscribe(x => window.location.href = x.returnUrl);
          }
          else {
            this.openSm(this.content3);
          }
        });
    }
  }
}
