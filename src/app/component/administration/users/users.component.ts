import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClientUserService } from 'src/app/services/http-client-user.service';
import { IUser } from 'src/app/interfaces/i-user';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { defaultIfEmpty } from 'rxjs/operators';

@Component({
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnDestroy, OnInit {
  users: IUser[] = [];
  selection: SelectionModel<IUser> = new SelectionModel<IUser>(true, []);
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();

  constructor(
    private Router: Router,
    private HttpClientUserService: HttpClientUserService) {

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

    this.HttpClientUserService.getUsers().subscribe(users => {
      this.users = users;
      // Calling the DT trigger to manually render the table
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

  addUser(): void {
    this.Router.navigate(['/component/administration/users/create']);
  }

  deleteSelected(): void {

    var deleted = this.selection.selected.map(x => {
      return this.HttpClientUserService.deleteUser(x);
    }) || [];

    forkJoin(deleted)
      .pipe(defaultIfEmpty(null))
      .subscribe(
        x => {
          this.users = this.users.filter(y => {
            var found = this.selection.selected.filter(z => {
              return z._id == y._id;
            }) || [];
            return found.length <= 0;
          });

          this.rerender();
          this.selection.clear();
        },
        err => {
          console.log(err);
        },
        () => {

        });
  }
}