import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRole } from './../../interfaces/i-role';
import { Role } from './../../models/role';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientRoleService } from './../../services/http-client-role.service';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Options } from 'select2';
import { Select2OptionData } from 'ng-Select2';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html'
})
export class RoleDetailComponent implements AfterViewInit, OnInit {
  roleDetailsForm: FormGroup = this.formBuilder.group(new Role());
  roles: Observable<IRole[]> = this.HttpClientRoleService.getRoles();
  selectedRoles: SelectionModel<string> = new SelectionModel<string>(true, []);
  public options: Options;
  public select2Roles: Array<Select2OptionData>;

  constructor(
    private router: Router,
    private HttpClientRoleService: HttpClientRoleService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  f(): FormGroup {
    return this.roleDetailsForm;
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    const _id = this.route.snapshot.paramMap.get('id');
    this.f().controls.name.setValidators(Validators.required);
    if (_id) {
      this.HttpClientRoleService.getRole(_id)
        .subscribe(x => {
          this.f().controls._id.setValue(x._id || '');
          this.f().controls.name.setValue(x.name || '');
        });
    }
    else {

    }
  }

  save(): void {
    if (this.f().valid) {
      const role: IRole = {
        _id: this.f().get('_id').value,
        name: this.f().get('name').value,
      } as Role;

      if (role._id) {
        this.HttpClientRoleService.updateRole(role)
          .subscribe(x => {
            this.router.navigate(['/component/administration/roles']);
          });
      }
      else {
        this.HttpClientRoleService.addRole(role)
          .subscribe(x => {
            this.router.navigate(['/component/administration/roles']);
          });
      }
    }
  }
}
