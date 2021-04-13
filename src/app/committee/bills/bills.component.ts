import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClientHouseService } from './../../services/http-client-house.service';
import { HttpClientBillService } from './../../services/http-client-bill.service';
import { IBill } from './../../interfaces/i-bill';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BillStatus } from './../../enums/bill-status.enum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html'
})
export class BillsComponent implements OnDestroy, OnInit {
  bills: IBill[] = [];
  selection: SelectionModel<IBill> = new SelectionModel<IBill>(true, []);
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  public get billStatus() { return BillStatus; }

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();

  constructor(
    private Router: Router,
    private Location: Location,
    private HttpClientBillService: HttpClientBillService,
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

    this.HttpClientBillService.getBills()
      .subscribe(bills => {

        this.bills = bills || [];
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      });
  }

  backClicked() {
    this.Location.back();
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

  changeStatus(bill: IBill): void {
    bill.houseId = (bill as any).house?._id;
    bill.status = bill.status ? 0 : 1; 
    this.HttpClientBillService.updateBill(bill).subscribe(x => {
    });
  }

  deleteSelected(): void {
    this.selection.selected.forEach(x => {
      this.HttpClientBillService.deleteBill(x).subscribe();
    });

    this.bills = this.bills.filter(y => {
      var found = this.selection.selected.filter(z => {
        return z._id == y._id;
      }) || [];
      return found.length <= 0;
    });

    this.rerender();
    this.selection.clear();
  }
}