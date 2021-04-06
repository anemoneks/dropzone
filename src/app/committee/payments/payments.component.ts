import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClientHouseService } from './../../services/http-client-house.service';
import { HttpClientPaymentService } from './../../services/http-client-payment.service';
import { IHousePayment } from './../../interfaces/i-house-payment';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Payment } from './../../models/payment';
import { HousePayment } from './../../models/house-payment';
import { FileUpload } from './../../shared/file-upload';
import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IHouse } from './../../interfaces/i-house';
import { IPayment } from './../../interfaces/i-payment';
import { Options } from 'select2';
import { Select2OptionData } from 'ng-Select2';
import { House } from './../../models/house';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html'
})
export class PaymentsComponent implements OnDestroy, OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private Router: Router,
    private HttpClientPaymentService: HttpClientPaymentService,
    private HttpClientHouseService: HttpClientHouseService,
    private modalService: NgbModal,
    private fileUpload: FileUpload) {

  }

  public paymentDetailForm: FormGroup;

  paidDate: NgbDateStruct;
  housePayments: IHousePayment[] = [];
  selection: SelectionModel<IHousePayment> = new SelectionModel<IHousePayment>(true, []);
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  selection2: SelectionModel<IHousePayment> = new SelectionModel<IHousePayment>(true, []);
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

    this.HttpClientHouseService.getHouses().subscribe(houses => {
      this.housePayments = [].concat.apply([],
        (houses.map(h => {
          return h.payments.map(p => {
            return {
              house: new House(h),
              payment: p,
            } as IHousePayment;
          });

        }) || []

        ));
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

  onDateChange(date: NgbDateStruct) {
    this.paymentDetailForm.get('payment.paidDate').setValue(new Date(this.paidDate.year, this.paidDate.month - 1, this.paidDate.day));
  }

  addPayment(): void {

    if (!this.paymentDetailForm.valid)
      return;

    const house = this.paymentDetailForm.get('house').value;
    const payment = this.paymentDetailForm.get('payment').value;

    this.modalService.dismissAll();

    if ((payment?._id || '') == '') {
      this.HttpClientHouseService.getHouse(house._id).subscribe(h => {
        this.HttpClientPaymentService.addPayment(payment)
          .subscribe(
            p => {
              h.payments.push(p[0]);
              this.housePayments.push({ house: new House(h), payment: p[0] } as IHousePayment);
              this.rerender();
            },
            err => {

            },
            () => {
              this.HttpClientHouseService.updateHouse(h).subscribe();
            });
      });
    }
    else {

      // determine the initial house
      const filtered = (this.housePayments.filter(hp => {
        return hp.payment._id == payment._id;
      }) || [])[0]?.house;
      filtered.payments = filtered.payments.filter(p => {
        return p._id != payment._id;
      }) || [];

      forkJoin([
        this.HttpClientHouseService.getHouse(house._id),
        this.HttpClientPaymentService.getPayment(payment._id)
      ]).subscribe(r => {

        const _house = r[0];
        const _payment = r[1];

        // check if payment already exists
        let found = (_house.payments || []).filter(p => {
          return p._id == _payment._id;
        }) || [];
        if (found.length <= 0)
          _house.payments.push(_payment);

        _payment.paidDate = payment.paidDate;
        _payment.referenceNo = payment.referenceNo;
        _payment.amount = payment.amount;
        _payment.filename = payment.filename;
        _payment.attachment = payment.attachment;

        const selected = (this.housePayments.filter(hp => {
          return hp.payment._id == payment._id;
        }) || [])[0]?.house;

        selected.payments = selected.payments.filter(p => {
          return p._id != payment._id;
        }) || [];

        forkJoin([
          this.HttpClientHouseService.updateHouse(selected),
          this.HttpClientHouseService.updateHouse(_house),
          this.HttpClientPaymentService.updatePayment(_payment),
        ]).subscribe(u => {

          this.HttpClientHouseService.getHouses()
            .subscribe(houses => {

              this.housePayments = [].concat.apply([],
                (houses.map(h => {
                  return h.payments.map(p => {
                    return {
                      house: new House(h),
                      payment: p,
                    } as IHousePayment;
                  });
                }) || []));

              this.rerender();
            });
        },
          err => {
            console.log(err);
          },
          () => {
            console.log('completed');
          });
      });

    }
  }

  handleFileInput(files: FileList) {
    let file = files[0];
    forkJoin([this.fileUpload.toBase64(file)])
      .subscribe(value => {
        (this.paymentDetailForm.controls.payment as FormGroup).controls.attachment.setValue(value[0]);
        (this.paymentDetailForm.controls.payment as FormGroup).controls.filename.setValue(file.name);
      });
  }

  open2(content, paymentId): void {
    const housePayment = (this.housePayments.filter(x => x.payment?._id == paymentId) || [])[0] || new HousePayment();

    this.paymentDetailForm = this.formBuilder.group({
      house: this.formBuilder.group(new House(housePayment?.house || new House())),
      payment: this.formBuilder.group(housePayment?.payment || new Payment()),
    });

    // Payment Form
    this.paymentDetailForm.get('house._id').setValidators([Validators.required]);

    this.paymentDetailForm.get('payment.paidDate').setValidators([Validators.required]);
    this.paymentDetailForm.get('payment.referenceNo').setValidators([Validators.required]);
    this.paymentDetailForm.get('payment.amount').setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
    this.paymentDetailForm.get('payment.filename').setValidators([Validators.required]);

    let paidDate = new Date(housePayment.payment?.paidDate);
    this.paidDate = housePayment.payment?.paidDate == null ? null :
      { year: paidDate.getFullYear(), month: paidDate.getMonth() + 1, day: paidDate.getDate() } as NgbDateStruct;

    this.paymentDetailForm.get('house._id').setValue(new House(housePayment.house)._id);
    this.paymentDetailForm.get('payment._id').setValue(housePayment.payment?._id);
    this.paymentDetailForm.get('payment.paidDate').setValue(housePayment.payment?.paidDate);
    this.paymentDetailForm.get('payment.referenceNo').setValue(housePayment.payment?.referenceNo);
    this.paymentDetailForm.get('payment.amount').setValue(housePayment.payment?.amount);
    this.paymentDetailForm.get('payment.attachment').setValue(housePayment.payment?.attachment || '');
    this.paymentDetailForm.get('payment.filename').setValue(housePayment.payment?.filename || '');

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title'
    })
      .result
      .then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

    const deleted = this.selection.selected.map(x => this.HttpClientPaymentService.deletePayment(x.payment)) || [];
    forkJoin(deleted)
      .subscribe(d => {

        this.housePayments = this.housePayments.filter(y => {
          var found = this.selection.selected.filter(z => {
            return z.payment._id == y.payment._id;
          }) || [];
          return found.length <= 0;
        });

        this.rerender();
        this.selection.clear();
      });
  }

  onHouseChange($event): void {
  }
}