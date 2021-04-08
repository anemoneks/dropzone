import { Payment } from './../../models/payment';
import { Component, OnInit, ViewChild, ViewRef, TemplateRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientPaymentService } from './../../services/http-client-payment.service';
import { House } from './../../models/house';
import { Router, ActivatedRoute } from '@angular/router';
import { Select2OptionData } from 'ng-Select2';
import { Options } from 'select2';
import { HttpClientUserService } from './../../services/http-client-user.service';
import { HttpClientBillService } from './../../services/http-client-bill.service';
import { NgbModal, ModalDismissReasons, NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidator } from './../../shared/validators/custom-validator';
import { IPayment } from './../../interfaces/i-payment';
import { HttpClientHouseService } from './../../services/http-client-house.service';
import { forkJoin } from 'rxjs';
import { FileUpload } from './../../shared/file-upload';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html'
})
export class PaymentDetailComponent implements OnInit {

  public options: Options;
  public select2houses: Array<Select2OptionData>;
  public paidDate: NgbDateStruct;
  public files: File[] = [];
  public selectedFiles: Array<string> = new Array<string>();

  constructor(
    private Location: Location,
    public formatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private Router: Router,
    private formBuilder: FormBuilder,
    private HttpClientHouseService: HttpClientHouseService,
    private HttpClientPaymentService: HttpClientPaymentService,
    private fileUpload: FileUpload
  ) { }

  // Bill Form
  public paymentDetailForm: FormGroup = this.formBuilder.group({
    payment: this.formBuilder.group(new Payment()),
  });;

  f(): FormGroup {
    return this.paymentDetailForm;
  };

  public get paymentId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {

    this.paymentDetailForm.get('payment.houseId').setValidators([Validators.required]);
    this.paymentDetailForm.get('payment.paidDate').setValidators([Validators.required]);
    this.paymentDetailForm.get('payment.referenceNo').setValidators([Validators.required]);
    this.paymentDetailForm.get('payment.filename').setValidators([Validators.required]);
    this.paymentDetailForm.get('payment.amount').setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*(\.[0-9]+)?$')]);

    if (this.paymentId != '') {
      this.HttpClientPaymentService.getPayment(this.paymentId)
        .subscribe(x => {
          this.paymentDetailForm.get('payment._id').setValue(x._id || null);
          this.paymentDetailForm.get('payment.houseId').setValue((x as any).house?._id || null);
          this.paymentDetailForm.get('payment.paidDate').setValue(x.paidDate || null);
          let paidDate = new Date(x.paidDate);
          this.paidDate = { year: paidDate.getFullYear(), month: paidDate.getMonth(), day: paidDate.getDate() } as NgbDateStruct;
          this.paymentDetailForm.get('payment.referenceNo').setValue(x.referenceNo || null);
          this.paymentDetailForm.get('payment.filename').setValue(x.filename || null);
          this.paymentDetailForm.get('payment.amount').setValue(x.amount || '');
          this.paymentDetailForm.get('payment.attachment').setValue(x.attachment || '');
          this.paymentDetailForm.get('payment.filename').setValue(x.filename || '');
        });
    }

    this.HttpClientHouseService.getOwnerHouses()
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

  onDateChange(date: NgbDateStruct) {
    this.paymentDetailForm.get('payment.paidDate').setValue(new Date(this.paidDate.year, this.paidDate.month - 1, this.paidDate.day));
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
        this.paymentDetailForm.get('payment.attachment').setValue(value[0]);
        this.paymentDetailForm.get('payment.filename').setValue(file.name);
      });
  }

  previewImage(): void {
    alert("to be downloaded");
  }

  backClicked() {
    this.Location.back();
  }

  removeImage(): void {
    this.paymentDetailForm.get('payment.attachment').setValue(null);
    this.paymentDetailForm.get('payment.filename').setValue(null);
  }

  save(): void {
    this.f().markAllAsTouched();
    if (this.f().valid) {
      const payment: IPayment = {
        _id: this.f().get('payment._id').value,
        houseId: this.f().get('payment.houseId').value,
        referenceNo: this.f().get('payment.referenceNo').value,
        amount: this.f().get('payment.amount').value,
        attachment: this.f().get('payment.attachment').value,
        filename: this.f().get('payment.filename').value,
        paidDate: this.f().get('payment.paidDate').value,
      } as IPayment;

      if ((payment._id || '') == '') {
        this.HttpClientPaymentService.addPayment(payment)
          .subscribe(x => {
            this.Router.navigate(['/owner/payments']);
          });
      }
      else {
        this.HttpClientPaymentService.updatePayment(payment)
          .subscribe(x => {
            this.Router.navigate(['/owner/payments']);
          });
      }
    }
  }
}
