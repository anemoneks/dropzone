import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClientRoleService } from '../../../../app/services/http-client-role.service';
import { IRole } from '../../../../app/interfaces/i-role';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnDestroy, OnInit {
  roles: IRole[] = [];
  selection: SelectionModel<IRole> = new SelectionModel<IRole>(true, []);
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();

  constructor(
    private Router: Router,
    private HttpClientRoleService: HttpClientRoleService) {
  }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [
        {
          targets: -1,
          className: 'dt-body-center'
        }
      ],
      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]]
    };

    this.HttpClientRoleService.getRoles()
      .subscribe(roles => {
        this.roles = roles;
        this.dtTrigger.next();
      });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  deleteSelected(): void {
    this.selection.selected.forEach(x => {
      this.HttpClientRoleService.deleteRole(x).subscribe();
    });

    this.roles = this.roles.filter(y => {
      var found = this.selection.selected.filter(z => {
        return z._id == y._id;
      }) || [];
      return found.length <= 0;
    });

    this.rerender();
    this.selection.clear();
  }

  addRole(): void {
    this.Router.navigate(['/component/administration/roles/create']);
  }
}