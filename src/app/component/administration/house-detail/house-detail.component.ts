import { Component, OnInit, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientHouseService } from 'src/app/services/http-client-house.service';
import { HttpClientPaymentService } from 'src/app/services/http-client-payment.service';
import { IHouse } from './../../../interfaces/i-house';
import { House } from 'src/app/models/house';
import { Bill } from 'src/app/models/bill';
import { FileUpload } from 'src/app/shared/file-upload';
import { Router, ActivatedRoute } from '@angular/router';
import { Select2OptionData } from 'ng-Select2';
import { Options } from 'select2';
import { HttpClientUserService } from 'src/app/services/http-client-user.service';
import { HttpClientBillService } from 'src/app/services/http-client-bill.service';
import { IBill } from 'src/app/interfaces/i-bill';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTableDirective } from 'angular-datatables';
import { Subject, forkJoin } from 'rxjs';
import { BillStatus } from 'src/app/enums/bill-status.enum';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { finalize, defaultIfEmpty } from 'rxjs/operators';
import * as moment from 'moment';
import { CustomValidator } from 'src/app/shared/validators/custom-validator';
import { IPayment } from 'src/app/interfaces/i-payment';
import { Payment } from 'src/app/models/payment';
import { IHousePayment } from 'src/app/interfaces/i-house-payment';
import { HousePayment } from 'src/app/models/house-payment';

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styles: [`
  .custom-day {
    text-align: center;
    padding: 0.185rem 0.25rem;
    display: inline-block;
    height: 2rem;
    width: 2rem;
  }
  .custom-day.focused {
    background-color: #e6e6e6;
  }
  .custom-day.range, .custom-day:hover {
    background-color: rgb(2, 117, 216);
    color: white;
  }
  .custom-day.faded {
    background-color: rgba(2, 117, 216, 0.5);
  }
`]
})
export class HouseDetailComponent implements OnInit, AfterViewInit {
  constructor(
    private CustomValidator: CustomValidator,
    public formatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private Router: Router,
    private HttpClientBillService: HttpClientBillService,
    private formBuilder: FormBuilder,
    private HttpClientUserService: HttpClientUserService,
    private HttpClientHouseService: HttpClientHouseService,
    private modalService: NgbModal,
    private HttpClientPaymentService: HttpClientPaymentService,
    private fileUpload: FileUpload
  ) {

  }

  bills: IBill[] = [];
  payments: IPayment[] = [];
  selection: SelectionModel<IBill> = new SelectionModel<IBill>(true, []);
  selection2: SelectionModel<IHousePayment> = new SelectionModel<IHousePayment>(true, []);
  dtOptions: DataTables.Settings = {};
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  paidDate: NgbDateStruct;
  housePayments: IHousePayment[] = [];

  public houseDetailForm: FormGroup = this.formBuilder.group(new House());
  public exampleData: Array<Select2OptionData>;
  public options: Options;
  public users: string[];

  public paymentDetailForm: FormGroup = this.formBuilder.group(new Payment());
  public billDetailForm: FormGroup = this.formBuilder.group(new Bill());;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();
  dtTrigger2 = new Subject();

  closeResult: string;

  f(): FormGroup {
    return this.houseDetailForm;
  };

  public get houseId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  public get billStatus() { return BillStatus; }

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

  ngAfterViewInit(): void {
    if (this.houseId == '') {
      this.dtTrigger.next();
      this.dtTrigger2.next();
    }
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
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
    };


    this.HttpClientUserService.getUsers().subscribe(users => {
      this.exampleData = (users || [])
        .sort((a, b) => a.username.localeCompare(b.username))
        .map(u => {
          return {
            id: u._id.toString(),
            text: u.username
          } as Select2OptionData;
        });

      this.options = {
        width: '100%',
        multiple: true,
      };
    })

    if (this.houseId != '') {
      this.HttpClientHouseService.getHouse(this.houseId)
        .pipe(
          finalize(() => {
            // Calling the DT trigger to manually render the table
            this.dtTrigger.next();
            this.dtTrigger2.next();
          })
        )
        .subscribe(x => {
          this.houseDetailForm.controls._id.setValue(x._id || null);
          this.houseDetailForm.controls.unit.setValue(x.unit || '');
          this.houseDetailForm.controls.street.setValue(x.street || '');
          this.houseDetailForm.controls.users.setValue((x.users || []).map(u => u._id || ''));
          this.houseDetailForm.controls.bills.setValue((x.bills || []));
          this.houseDetailForm.controls.unit.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
          this.houseDetailForm.controls.street.setValidators(Validators.required);
          this.bills = x.bills;

          this.housePayments = x.payments.map(p => {
            return { house: new House(x), payment: p } as IHousePayment;
          }) || [];
        });
    } else {
      this.houseDetailForm.controls.unit.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
      this.houseDetailForm.controls.street.setValidators(Validators.required);
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if (dtElement?.dtInstance) {

        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again

          if (index == 0)
            this.dtTrigger.next();

          if (index == 1)
            this.dtTrigger2.next();
        });
      }
    });
  }

  addBill(): void {

    if (this.billDetailForm.valid) {
      const bill = {
        _id: this.billDetailForm.get('_id').value,
        invoiceNo: this.billDetailForm.get('invoiceNo').value,
        amount: +(this.billDetailForm.get('amount').value || 0),
        billMonth: +this.billDetailForm.get('billMonth').value,
        billYear: +this.billDetailForm.get('billYear').value,
        status: BillStatus.Pending,
      } as IBill;

      this.modalService.dismissAll();

      if (this.houseId != '') {
        this.HttpClientHouseService.getHouse(this.houseId)
          .subscribe(house => {

            if ((bill._id || '') == '') {
              this.HttpClientBillService.addBill(bill)
                .subscribe(x => {
                  this.bills = this.bills || [];
                  this.bills.push(x[0]);
                  house.bills = this.bills;
                  this.rerender();
                  this.HttpClientHouseService.updateHouse(house).subscribe();
                });
            }
            else {

              this.bills = this.bills.map(b => {
                if (b._id != bill._id)
                  return b;

                b.invoiceNo = bill.invoiceNo;
                b.amount = bill.amount;
                b.billMonth = bill.billMonth;
                b.billYear = bill.billYear;
                b.status = bill.status;
                return b;
              }) || [];
              this.rerender();

              this.HttpClientBillService.updateBill(bill).subscribe();
            }
          });
      }
      else {
        this.bills.push(bill);
        this.rerender();
      }
    }
  }

  deleteSelected(): void {
    var deleted = this.selection.selected.map(x => {
      return this.HttpClientBillService.deleteBill(x);
    }) || [];

    forkJoin(deleted).subscribe(
      value => console.log(value),
      err => { console.log(err); },
      () => {

        this.HttpClientHouseService.getHouse(this.houseId)
          .subscribe(
            house => {
              house.bills = this.bills;
              this.HttpClientHouseService.updateHouse(house).subscribe();
            },
            err => { console.log(err); },
            () => {

              this.bills = this.bills.filter(y => {
                var found = this.selection.selected.filter(z => {
                  return z._id == y._id;
                }) || [];
                return found.length <= 0;
              }) || [];

              this.rerender();
              this.selection.clear();

            });
      }
    );
  }

  deleteSelected2(): void {
    var deleted = this.selection2.selected.map(x => {
      return this.HttpClientPaymentService.deletePayment(x.payment);
    }) || [];

    forkJoin(deleted).subscribe(
      value => console.log(value),
      err => { console.log(err); },
      () => {

        this.HttpClientHouseService.getHouse(this.houseId)
          .subscribe(
            house => {
              house.payments = this.housePayments.map(hp => hp.payment) || [];
              this.HttpClientHouseService.updateHouse(house).subscribe();
            },
            err => { console.log(err); },
            () => {

              this.housePayments = this.housePayments.filter(y => {
                var found = this.selection2.selected.filter(z => {
                  return z.payment._id == y.payment._id;
                }) || [];
                return found.length <= 0;
              }) || [];

              this.rerender();
              this.selection2.clear();

            });
      }
    );
  }

  closeSelected(): void {
    const updated = (this.selection.selected || [])
      .map(x => {
        x.status = BillStatus.Paid;
        return x;
      }) || [];

    this.bills = this.bills.map(x => {
      var found = ((this.selection.selected || []).filter(b => b.billMonth == x.billMonth && b.billYear == x.billYear) || []).length > 0;
      if (found)
        x.status = BillStatus.Paid;
      return x;
    }) || [];
    this.rerender();
    this.selection.clear();
  }

  open(content, billId): void {
    const bill = (this.bills.filter(x => x._id == billId) || [])[0] || new Bill();
    this.billDetailForm = this.formBuilder.group(bill);;

    // Bill Form
    this.billDetailForm.controls.invoiceNo.setValidators([Validators.required]);
    this.billDetailForm.controls.amount.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
    this.billDetailForm.controls.billMonth.setValidators([Validators.required]);
    this.billDetailForm.controls.billYear.setValidators([Validators.required]);

    this.billDetailForm.controls.billMonth.setAsyncValidators([this.CustomValidator.billPeriodValidator(this.bills, bill._id || '', bill.billMonth, bill.billYear)]);
    this.billDetailForm.controls.billYear.setAsyncValidators([this.CustomValidator.billPeriodValidator(this.bills, bill._id || '', bill.billMonth, bill.billYear)]);

    this.billDetailForm.controls.amount.setValue(bill.amount);
    this.billDetailForm.controls.invoiceNo.setValue(bill.invoiceNo);
    this.billDetailForm.controls.billMonth.setValue(bill.billMonth);
    this.billDetailForm.controls.billYear.setValue(bill.billYear);

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

  open2(content, paymentId): void {
    const housePayment = (this.housePayments.filter(x => x.payment?._id == paymentId) || [])[0] || new HousePayment();

    this.paymentDetailForm = this.formBuilder.group({
      house: this.formBuilder.group(new House(housePayment?.house || new House())),
      payment: this.formBuilder.group(housePayment?.payment || new Payment()),
    });

    // Payment Form
    this.paymentDetailForm.get('payment.paidDate').setValidators([Validators.required]);
    this.paymentDetailForm.get('payment.referenceNo').setValidators([Validators.required]);
    this.paymentDetailForm.get('payment.amount').setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
    this.paymentDetailForm.get('payment.filename').setValidators([Validators.required]);

    let paidDate = new Date(housePayment.payment?.paidDate);
    this.paidDate = housePayment.payment?.paidDate == null ? null :
      { year: paidDate.getFullYear(), month: paidDate.getMonth() + 1, day: paidDate.getDate() } as NgbDateStruct;

    this.paymentDetailForm.get('house._id').setValue((this.houseId || '') == '' ? null : this.houseId);
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

  onBillMonthChange(): void {
    this.billDetailForm.controls.billMonth.updateValueAndValidity();
    this.billDetailForm.controls.billYear.updateValueAndValidity();
  }

  onBillYearChange(): void {
    this.billDetailForm.controls.billYear.updateValueAndValidity();
    this.billDetailForm.controls.billMonth.updateValueAndValidity();
  }

  addPayment(): void {

    if (!this.paymentDetailForm.valid)
      return;

    const house = this.paymentDetailForm.get('house').value;
    const payment = this.paymentDetailForm.get('payment').value;

    this.modalService.dismissAll();

    if ((this.houseId || '') != '') {
      if ((payment?._id || '') == '') {
        this.HttpClientHouseService.getHouse(house._id)
          .subscribe(h => {
            debugger;
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
    else {
      
      house.street = this.houseDetailForm.get('street').value;
      house.unit = this.houseDetailForm.get('unit').value;
      house.users = [];
      house.bills = [];
      house.payments = [];

      const housePayment = new HousePayment();
      housePayment.house = new House(house);
      housePayment.payment = payment;
      this.housePayments.push(housePayment);
      this.rerender();
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

  onDateChange(date: NgbDateStruct) {
    this.paymentDetailForm.get('payment.paidDate').setValue(new Date(this.paidDate.year, this.paidDate.month - 1, this.paidDate.day));
  }

  save(): void {
    if (this.houseDetailForm.valid &&
      (!this.modalService.hasOpenModals() || (this.modalService.hasOpenModals() && this.billDetailForm.valid))) {

      const house = new House(
        {
          _id: this.f().get('_id').value,
          id: this.f().get('id').value,
          unit: this.f().get('unit').value,
          street: this.f().get('street').value,
          users: this.f().get('users').value || [],
          bills: this.bills || [],
          payments: this.housePayments.map(hp => hp.payment) || [],
        } as IHouse);


      const bills = this.bills.map(b => this.HttpClientBillService.addBill(b)) || [];
      const payments = this.housePayments.map(hp => this.HttpClientPaymentService.addPayment(hp.payment)) || [];

      forkJoin({
        bills: forkJoin(bills)
          .pipe(defaultIfEmpty(null)),

        payments: forkJoin(payments)
          .pipe(defaultIfEmpty(null)),
      })
        .subscribe(
          ({ bills, payments }) => {
            house.bills = (bills == null ? [] : (bills.flat() || [])) as Bill[];
            house.payments = (payments == null ? [] : (payments.flat() || [])) as Payment[];

            if ((house._id || '') != '') {
              this.HttpClientHouseService.updateHouse(house)
                .subscribe(x => {
                  this.Router.navigate(['/component/administration/houses']);
                });
            }
            else {
              this.HttpClientHouseService.addHouse(house)
                .subscribe(x => {
                  this.Router.navigate(['/component/administration/houses']);
                });
            }
          },
          err => {

          },
          () => {

          }
        );
    }
  }
}
