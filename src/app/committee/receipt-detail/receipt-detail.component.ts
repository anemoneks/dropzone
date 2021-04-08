import { Receipt } from '../../models/receipt';
import { Component, OnInit, ViewChild, ViewRef, TemplateRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientReceiptService } from '../../services/http-client-receipt.service';
import { House } from '../../models/house';
import { Router, ActivatedRoute } from '@angular/router';
import { Select2OptionData } from 'ng-Select2';
import { Options } from 'select2';
import { NgbModal, ModalDismissReasons, NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IReceipt } from '../../interfaces/i-receipt';
import { HttpClientHouseService } from '../../services/http-client-house.service';
import { forkJoin } from 'rxjs';
import { FileUpload } from '../../shared/file-upload';
import { Location } from '@angular/common';

@Component({
  selector: 'app-receipt-detail',
  templateUrl: './receipt-detail.component.html'
})
export class ReceiptDetailComponent implements OnInit {

  public options: Options;
  public select2houses: Array<Select2OptionData>;
  public issuedDate: NgbDateStruct;
  public files: File[] = [];
  public selectedFiles: Array<string> = new Array<string>();

  constructor(
    private Location: Location,
    public formatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private Router: Router,
    private formBuilder: FormBuilder,
    private HttpClientHouseService: HttpClientHouseService,
    private HttpClientReceiptService: HttpClientReceiptService,
    private fileUpload: FileUpload
  ) { }

  // Bill Form
  public receiptDetailForm: FormGroup = this.formBuilder.group({
    receipt: this.formBuilder.group(new Receipt()),
  });;

  f(): FormGroup {
    return this.receiptDetailForm;
  };

  public get receiptId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {

    this.receiptDetailForm.get('receipt.houseId').setValidators([Validators.required]);
    this.receiptDetailForm.get('receipt.issuedDate').setValidators([Validators.required]);
    this.receiptDetailForm.get('receipt.referenceNo').setValidators([Validators.required]);
    this.receiptDetailForm.get('receipt.filename').setValidators([Validators.required]);
    this.receiptDetailForm.get('receipt.amount').setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*(\.[0-9]+)?$')]);

    if (this.receiptId != '') {
      this.HttpClientReceiptService.getReceipt(this.receiptId)
        .subscribe(x => {
          this.receiptDetailForm.get('receipt._id').setValue(x._id || null);
          this.receiptDetailForm.get('receipt.houseId').setValue((x as any).house?._id || null);
          this.receiptDetailForm.get('receipt.issuedDate').setValue(x.issuedDate || null);
          let issuedDate = new Date(x.issuedDate);
          this.issuedDate = { year: issuedDate.getFullYear(), month: issuedDate.getMonth(), day: issuedDate.getDate() } as NgbDateStruct;
          this.receiptDetailForm.get('receipt.referenceNo').setValue(x.referenceNo || null);
          this.receiptDetailForm.get('receipt.filename').setValue(x.filename || null);
          this.receiptDetailForm.get('receipt.amount').setValue(x.amount || '');
          this.receiptDetailForm.get('receipt.attachment').setValue(x.attachment || '');
          this.receiptDetailForm.get('receipt.filename').setValue(x.filename || '');
        });
    }

    this.HttpClientHouseService.getHouses()
      .subscribe(houses => {

        const mapped = (houses || []).map(h => {
          return new House(h);
        }) || [];

        console.log(mapped);

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
    this.receiptDetailForm.get('receipt.issuedDate').setValue(new Date(date.year, date.month - 1, date.day));
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
        this.receiptDetailForm.get('receipt.attachment').setValue(value[0]);
        this.receiptDetailForm.get('receipt.filename').setValue(file.name);
      });
  }

  previewImage(): void {
    alert("to be downloaded");
  }

  backClicked() {
    this.Location.back();
  }

  removeImage(): void {
    this.receiptDetailForm.get('receipt.attachment').setValue(null);
    this.receiptDetailForm.get('receipt.filename').setValue(null);
  }

  save(): void {
    this.f().markAllAsTouched();
    if (this.f().valid) {
      const receipt: IReceipt = {
        _id: this.f().get('receipt._id').value,
        houseId: this.f().get('receipt.houseId').value,
        referenceNo: this.f().get('receipt.referenceNo').value,
        amount: this.f().get('receipt.amount').value,
        attachment: this.f().get('receipt.attachment').value,
        filename: this.f().get('receipt.filename').value,
        issuedDate: this.f().get('receipt.issuedDate').value,
      } as IReceipt;

      if ((receipt._id || '') == '') {
        this.HttpClientReceiptService.addReceipt(receipt)
          .subscribe(x => {
            this.Router.navigate(['/committee/receipts']);
          });
      }
      else {
        this.HttpClientReceiptService.updateReceipt(receipt)
          .subscribe(x => {
            this.Router.navigate(['/committee/receipts']);
          });
      }
    }
  }
}
