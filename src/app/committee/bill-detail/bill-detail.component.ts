import { Bill } from '../../models/bill';
import { Component, OnInit, ViewChild, ViewRef, TemplateRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientBillService } from '../../services/http-client-bill.service';
import { House } from '../../models/house';
import { Router, ActivatedRoute } from '@angular/router';
import { Select2OptionData } from 'ng-Select2';
import { Options } from 'select2';
import { NgbModal, ModalDismissReasons, NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IBill } from '../../interfaces/i-bill';
import { HttpClientHouseService } from '../../services/http-client-house.service';
import { forkJoin } from 'rxjs';
import { FileUpload } from '../../shared/file-upload';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { CustomValidator } from './../../shared/validators/custom-validator';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html'
})
export class BillDetailComponent implements OnInit {

  public options: Options;
  public select2houses: Array<Select2OptionData>;
  public issuedDate: NgbDateStruct;
  public files: File[] = [];
  public selectedFiles: Array<string> = new Array<string>();

  constructor(
    private CustomValidator: CustomValidator,
    private Location: Location,
    private formatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private Router: Router,
    private formBuilder: FormBuilder,
    private HttpClientHouseService: HttpClientHouseService,
    private HttpClientBillService: HttpClientBillService,
    private fileUpload: FileUpload
  ) { }

  // Bill Form
  public billDetailForm: FormGroup = this.formBuilder.group(new Bill());;

  f(): FormGroup {
    return this.billDetailForm;
  };

  public get billId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {

    this.f().get('houseId').setValidators([Validators.required]);
    this.f().get('invoiceNo').setValidators([Validators.required]);
    this.f().get('amount').setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*(\.[0-9]+)?$')]);
    this.f().get('billMonth').setValidators([Validators.required]);
    this.f().get('billYear').setValidators([Validators.required]);
    this.f().get('attachment').setValidators([Validators.required]);
    this.f().get('filename').setValidators([Validators.required]);


    if (this.billId != '') {
      this.HttpClientBillService.getBill(this.billId)
        .subscribe(x => {
          this.f().get('_id').setValue(x._id || null);
          this.f().get('houseId').setValue((x as any).house?._id || null);
          this.f().get('invoiceNo').setValue(x.invoiceNo || null);
          this.f().get('amount').setValue(x.amount || null);
          this.f().get('billMonth').setValue(x.billMonth || null);
          this.f().get('billYear').setValue(x.billYear || null);
          this.f().get('filename').setValue(x.filename || null);
          this.f().get('attachment').setValue(x.attachment || null);
          this.f().get('status').setValue(x.status || null);

          this.f().get('billMonth').setAsyncValidators([this.CustomValidator.billPeriodValidator(x.billMonth, x.billYear)]);
          this.f().get('billYear').setAsyncValidators([this.CustomValidator.billPeriodValidator(x.billMonth, x.billYear)]);
        });
    }
    else {
      this.f().get('_id').setValue(null);
      this.f().get('houseId').setValue(null);
      this.f().get('invoiceNo').setValue(null);
      this.f().get('amount').setValue(null);
      this.f().get('billMonth').setValue(null);
      this.f().get('billYear').setValue(null);
      this.f().get('filename').setValue(null);
      this.f().get('attachment').setValue(null);
      this.f().get('status').setValue(0);
    }

    this.HttpClientHouseService.getHouses()
      .subscribe(houses => {

        const mapped = (houses || []).map(h => {
          return new House(h);
        }) || [];

        this.select2houses = mapped.sort((a, b) => {
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
  }

  public get months(): any[] {
    let months = Array(12).fill(12).map((x, i) => {
      return {
        id: i + 1,
        text: moment(i + 1, 'M').format('MMMM'),
      };
    });

    return months;
  }

  public compareFn(c1: any, c2: any): boolean {
    return (c1 || 0) == (c2 || 0);
  }

  public get years(): number[] {
    return Array(10).fill(10).map((x, i) => ((new Date()).getFullYear() + i) - 1);
  }

  onBillMonthChange(): void {
    this.f().controls.billMonth.updateValueAndValidity();
    this.f().controls.billYear.updateValueAndValidity();
  }

  onBillYearChange(): void {
    this.f().controls.billYear.updateValueAndValidity();
    this.f().controls.billMonth.updateValueAndValidity();
  }

  onDateChange(date: NgbDateStruct) {
    this.f().get('issuedDate').setValue(new Date(date.year, date.month - 1, date.day));
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);

    const reader = new FileReader();
    const _this = this;
    reader.onload = function (evt) {
      const base64 = evt.target.result;
      _this.selectedFiles.push(base64 as string);
    };
    const currentIndex = ((this.files || []).length) - 1;
    reader.readAsDataURL(this.files[currentIndex]);
  }

  onRemove(event) {
    const deletedIndex = this.files.indexOf(event);
    this.files.splice(deletedIndex, 1);
    this.selectedFiles.splice(deletedIndex, 1);
  }

  handleFileInput(files: FileList) {
    const file = files[0];
    forkJoin([this.fileUpload.toBase64(file)])
      .subscribe(value => {
        this.f().get('attachment').setValue(value[0]);
        this.f().get('filename').setValue(file.name);
      });
  }

  previewImage(): void {
    alert("to be downloaded");
  }

  backClicked() {
    this.Location.back();
  }

  removeImage(): void {
    this.f().get('attachment').setValue(null);
    this.f().get('filename').setValue(null);
  }

  save(): void {
    this.f().markAllAsTouched();
    if (this.f().valid) {
      const bill: IBill = {
        _id: this.f().get('_id').value,
        houseId: this.f().get('houseId').value,
        invoiceNo: this.f().get('invoiceNo').value,
        amount: this.f().get('amount').value,
        billMonth: this.f().get('billMonth').value,
        billYear: this.f().get('billYear').value,
        attachment: this.f().get('attachment').value,
        filename: this.f().get('filename').value,
      } as IBill;

      if ((bill._id || '') == '') {
        this.HttpClientBillService.addBill(bill)
          .subscribe(x => {
            this.Router.navigate(['/committee/bills']);
          });
      }
      else {
        this.HttpClientBillService.updateBill(bill)
          .subscribe(x => {
            this.Router.navigate(['/committee/bills']);
          });
      }
    }
  }
}
