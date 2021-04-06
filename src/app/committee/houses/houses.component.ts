import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClientHouseService } from './../../services/http-client-house.service';
import { IHouse } from './../../interfaces/i-house';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { defaultIfEmpty } from 'rxjs/operators';

@Component({
  templateUrl: './houses.component.html'
})
export class HousesComponent implements OnDestroy, OnInit {
  houses: IHouse[] = [];
  selection: SelectionModel<IHouse> = new SelectionModel<IHouse>(true, []);
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();

  constructor(
    private Router: Router,
    private HttpClientHouseService: HttpClientHouseService) {

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

    this.HttpClientHouseService.getHouses().subscribe(houses => {
      this.houses = houses;
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

  addHouse(): void {
    this.Router.navigate(['/committee/houses/create']);
  }

  deleteSelected(): void {

    const deleted = this.selection.selected.map(x => {
      return this.HttpClientHouseService.deleteHouse(x._id);
    }) || [];

    forkJoin(deleted)
      .pipe(defaultIfEmpty(null))
      .subscribe(x => {
        this.houses = this.houses.filter(y => {
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