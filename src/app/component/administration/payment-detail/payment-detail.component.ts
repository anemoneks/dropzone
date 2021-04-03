import { Payment } from 'src/app/models/payment';
import { Component, OnInit, ViewChild, ViewRef, TemplateRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientPaymentService } from 'src/app/services/http-client-payment.service';
import { IHouse } from './../../../interfaces/i-house';
import { House } from 'src/app/models/house';
import { Bill } from 'src/app/models/bill';
import { Router, ActivatedRoute } from '@angular/router';
import { Select2OptionData } from 'ng-Select2';
import { Options } from 'select2';
import { HttpClientUserService } from 'src/app/services/http-client-user.service';
import { HttpClientBillService } from 'src/app/services/http-client-bill.service';
import { IBill } from 'src/app/interfaces/i-bill';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTableDirective } from 'angular-datatables';
import { Subject, forkJoin, of, throwError } from 'rxjs';
import { BillStatus } from 'src/app/enums/bill-status.enum';
import { NgbModal, ModalDismissReasons, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { finalize, catchError, switchMap, flatMap, first } from 'rxjs/operators';
import * as moment from 'moment';
import { CustomValidator } from 'src/app/shared/validators/custom-validator';
import { InjectableCompiler } from '@angular/compiler/src/injectable_compiler';
import { IPayment } from 'src/app/interfaces/i-payment';
import { HttpClientHouseService } from 'src/app/services/http-client-house.service';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit {

  constructor(
    private CustomValidator: CustomValidator,
    public formatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private Router: Router,
    private HttpClientBillService: HttpClientBillService,
    private formBuilder: FormBuilder,
    private HttpClientUserService: HttpClientUserService,
    private HttpClientHouseService: HttpClientHouseService,
    private HttpClientPaymentService: HttpClientPaymentService,
    private modalService: NgbModal,
  ) { }

  // Bill Form
  public paymentDetailForm: FormGroup = this.formBuilder.group(new Payment());;

  f(): FormGroup {
    return this.paymentDetailForm;
  };

  public get paymentId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {

    if (this.paymentId != '') {
      this.HttpClientPaymentService.getPayment(this.paymentId)
        .subscribe(x => {
          this.paymentDetailForm.controls._id.setValue(x._id || null);
          this.paymentDetailForm.controls.amount.setValue(x.amount || '');
        });
    } else {
      this.paymentDetailForm.controls.amount.setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*(\.[0-9]+)?$')]);
    }
  }

  save(): void {
    const payment: IPayment = {
      _id: this.f().get('_id').value,
      referenceNo: this.f().get('referenceNo').value,
      amount: this.f().get('amount').value,
      attachment: null,
      filename: null,
    } as IPayment;

    if ((payment._id || '') == '') {
      this.HttpClientPaymentService.addPayment(payment)
        .subscribe(x => {
          this.Router.navigate(['/component/administration/payments']);
        });
    }
  }

}
