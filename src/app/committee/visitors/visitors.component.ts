import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClientVisitorService } from '../../services/http-client-visitor.service';
import { IVisitor } from '../../interfaces/i-visitor';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { defaultIfEmpty } from 'rxjs/operators';

@Component({
  templateUrl: './visitors.component.html'
})
export class VisitorsComponent implements OnDestroy, OnInit {
  visitors: IVisitor[] = [];
  selection: SelectionModel<IVisitor> = new SelectionModel<IVisitor>(true, []);
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();

  constructor(
    private Router: Router,
    private HttpClientVisitorService: HttpClientVisitorService) {

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

    this.HttpClientVisitorService.getVisitors().subscribe(visitors => {
      this.visitors = visitors;
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

  addVisitor(): void {
    this.Router.navigate(['/guard/visitor']);
  }

  deleteSelected(): void {

    const deleted = this.selection.selected.map(x => {
      return this.HttpClientVisitorService.deleteVisitor(x._id);
    }) || [];

    forkJoin(deleted)
      .pipe(defaultIfEmpty(null))
      .subscribe(x => {
        this.visitors = this.visitors.filter(y => {
          var found = this.selection.selected.filter(z => {
            return z._id == y._id;
          }) || [];
          return found.length <= 0;
        });

        this.rerender();
        this.selection.clear();
      });
  }
}