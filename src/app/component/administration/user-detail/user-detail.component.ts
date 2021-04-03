import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { IUser } from 'src/app/interfaces/i-user';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientUserService } from 'src/app/services/http-client-user.service';
import { CustomValidator } from 'src/app/shared/validators/custom-validator';
import { HttpClientRoleService } from 'src/app/services/http-client-role.service';
import { IRole } from 'src/app/interfaces/i-role';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Options } from 'select2';
import { Select2OptionData } from 'ng-Select2';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements AfterViewInit, OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  userDetailsForm: FormGroup = this.formBuilder.group(new User());
  roles: Observable<IRole[]> = this.HttpClientRoleService.getRoles();
  selectedRoles: SelectionModel<string> = new SelectionModel<string>(true, []);
  public options: Options;
  public select2Roles: Array<Select2OptionData>;

  constructor(
    private CustomValidator: CustomValidator,
    private router: Router,
    private HttpClientRoleService: HttpClientRoleService,
    private HttpClientUserService: HttpClientUserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  f(): FormGroup {
    return this.userDetailsForm;
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    const _id = this.route.snapshot.paramMap.get('id');

    this.f().controls.firstName.setValidators(Validators.required);
    this.f().controls.lastName.setValidators(Validators.required);
    this.f().controls.email.setValidators([Validators.required, Validators.email]);
    this.f().controls.username.setValidators([Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z ].*')]);

    this.HttpClientRoleService.getRoles().subscribe(users => {
      this.select2Roles = (users || [])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(u => {
          return {
            id: u._id.toString(),
            text: u.name
          } as Select2OptionData;
        });

      this.options = {
        width: '100%',
        multiple: true,
      };
    });

    if (_id) {
      this.HttpClientUserService.getUser(_id)
        .subscribe(x => {
          this.f().controls._id.setValue(x[0]._id || '');
          this.f().controls.firstName.setValue(x[0].firstName || '');
          this.f().controls.lastName.setValue(x[0].lastName || '');
          this.f().controls.email.setValue(x[0].email || '');
          this.f().controls.username.setValue(x[0].username || '');
          this.f().controls.password.setValue('');
          this.f().controls.roles.setValue(x[0].roles || []);
          this.f().controls.avatar.setValue({});

          this.f().controls.email.setAsyncValidators(this.CustomValidator.emailInUsedValidator(x[0].email || ''));
          this.f().controls.username.setAsyncValidators(this.CustomValidator.usernameInUsedValidator(x[0].username || ''));

          this.f().controls.password.setValidators([Validators.minLength(6)]);

          (x.roles || []).forEach(r => {
            this.selectedRoles.select(r._id);
          });
        });
    }
    else {
      this.f().controls.email.setAsyncValidators(this.CustomValidator.emailInUsedValidator(''));
      this.f().controls.username.setAsyncValidators(this.CustomValidator.usernameInUsedValidator(''));

      this.f().controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    }

    this.f().controls.password.setAsyncValidators(this.CustomValidator.mustMatch('confirmPassword'));
    this.f().controls.confirmPassword.setAsyncValidators(this.CustomValidator.mustMatch('password'));

    this.f().get('confirmPassword').valueChanges.subscribe(
      () => {
        this.f().get('password').updateValueAndValidity({ emitEvent: false });
      }
    );

    this.f().get('password').valueChanges.subscribe(
      () => {
        this.f().get('confirmPassword').updateValueAndValidity({ emitEvent: false });
      }
    );
  }

  onFileChange(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {

        const avatar = {
          filename: file.name,
          filetype: file.type,
          value: reader.result.toString().split(',')[1]
        };

        this.f().get('avatar').setValue(avatar);
      };
    }
    else {
      this.f().controls.avatar.setValue({});
    }
  }

  save(): void {
    if (this.f().valid) {
      const user: IUser = {
        _id: this.f().get('_id').value,
        firstName: this.f().get('firstName').value || '',
        lastName: this.f().get('lastName').value || '',
        email: this.f().get('email').value || '',
        username: this.f().get('username').value || '',
        password: this.f().get('password').value || '',
        roles: this.f().get('roles').value || '',
        avatar: this.f().get('avatar').value || {},
      } as User;

      if (user._id) {
        this.HttpClientUserService.updateUser(user)
          .subscribe(x => {
            this.router.navigate(['/component/administration/users']);
          });
      }
      else {
        this.HttpClientUserService.addUser(user)
          .subscribe(x => {
            this.router.navigate(['/component/administration/users']);
          });
      }
    }
  }
}
