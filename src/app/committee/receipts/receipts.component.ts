import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClientHouseService } from '../../services/http-client-house.service';
import { HttpClientReceiptService } from '../../services/http-client-receipt.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Receipt } from '../../models/receipt';
import { FileUpload } from '../../shared/file-upload';
import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IHouse } from '../../interfaces/i-house';
import { IReceipt } from '../../interfaces/i-receipt';
import { Options } from 'select2';
import { Select2OptionData } from 'ng-Select2';
import { House } from '../../models/house';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html'
})
export class ReceiptsComponent implements OnDestroy, OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private HttpClientReceiptService: HttpClientReceiptService,
    private HttpClientHouseService: HttpClientHouseService,
    private modalService: NgbModal,
    private fileUpload: FileUpload) {

  }

  public receiptDetailForm: FormGroup;

  paidDate: NgbDateStruct;
  receipts: IReceipt[] = [];
  selection: SelectionModel<IReceipt> = new SelectionModel<IReceipt>(true, []);
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  selection2: SelectionModel<IReceipt> = new SelectionModel<IReceipt>(true, []);
  closeResult: string;
  houses: Observable<IHouse[]> = this.HttpClientHouseService.getHouses();
  selectedRoles: SelectionModel<string> = new SelectionModel<string>(true, []);
  public options: Options;
  public select2Roles: Array<Select2OptionData>;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();

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

    this.HttpClientHouseService.getHouses()
      .subscribe(houses => {

        const mapped = (houses || []).map(h => {
          return new House(h);
        }) || [];

        this.select2Roles = mapped.sort((a, b) => {
          return a.address().localeCompare(b.address());
        })
          .map(u => {
            return {
              id: u._id.toString(),
              text: u.address(),
            } as Select2OptionData;
          });

        this.options = {
          width: '100%',
          multiple: false,
        };
      });

    forkJoin([
      this.HttpClientReceiptService.getReceipts()
    ]).subscribe(results => {
      this.receipts = results[0] || [];
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

  onDateChange(date: NgbDateStruct) {
    this.receiptDetailForm.get('receipt.paidDate').setValue(new Date(this.paidDate.year, this.paidDate.month - 1, this.paidDate.day));
  }

  handleFileInput(files: FileList) {
    let file = files[0];
    forkJoin([this.fileUpload.toBase64(file)])
      .subscribe(value => {
        (this.receiptDetailForm.controls.receipt as FormGroup).controls.attachment.setValue(value[0]);
        (this.receiptDetailForm.controls.receipt as FormGroup).controls.filename.setValue(file.name);
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  deleteSelected(): void {

    const deleted = this.selection.selected.map(x => this.HttpClientReceiptService.deleteReceipt(x)) || [];
    forkJoin(deleted)
      .subscribe(d => {

        this.receipts = this.receipts.filter(y => {
          var found = this.selection.selected.filter(z => {
            return z._id == y._id;
          }) || [];
          return found.length <= 0;
        }) || [];

        this.rerender();
        this.selection.clear();
      });
  }

  onHouseChange($event): void {
  }
}