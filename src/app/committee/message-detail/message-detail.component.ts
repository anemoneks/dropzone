import { Message } from '../../models/message';
import { Component, OnInit, ViewChild, ViewRef, TemplateRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientMessageService } from '../../services/http-client-message.service';
import { House } from '../../models/house';
import { Router, ActivatedRoute } from '@angular/router';
import { Select2OptionData } from 'ng-Select2';
import { Options } from 'select2';
import { NgbModal, ModalDismissReasons, NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IMessage } from '../../interfaces/i-message';
import { HttpClientHouseService } from '../../services/http-client-house.service';
import { forkJoin, throwError } from 'rxjs';
import { FileUpload } from '../../shared/file-upload';
import { Location } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { IHouse } from 'src/app/interfaces/i-house';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html'
})
export class MessageDetailComponent implements OnInit {

  public options: Options;
  public select2houses: Array<Select2OptionData>;
  public issuedDate: NgbDateStruct;
  public files: File[] = [];
  public selectedFiles: Array<string> = new Array<string>();
  public releasedDate: NgbDateStruct;
  public selectedHouses: IHouse[] = new Array<IHouse>();

  constructor(
    private Location: Location,
    public formatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private Router: Router,
    private formBuilder: FormBuilder,
    private HttpClientHouseService: HttpClientHouseService,
    private HttpClientMessageService: HttpClientMessageService,
    private fileUpload: FileUpload,
  ) { }

  // Bill Form
  public messageDetailForm: FormGroup = this.formBuilder.group(new Message());;

  f(): FormGroup {
    return this.messageDetailForm;
  };

  public get messageId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  selectAll(): void {
    const selected = !(this.f().get('allHouses').value ?? false);
    this.f().get('allHouses').setValue(selected);

    if (selected)
      this.f().get('houses').setValue(null);
  }

  ngOnInit(): void {

    this.f().get('subject').setValidators([Validators.required]);
    this.f().get('body').setValidators([Validators.required]);

    if (this.messageId != '') {
      this.HttpClientMessageService.getMessage(this.messageId)
        .subscribe(x => {
          this.f().get('_id').setValue(x._id || null);
          this.f().get('allHouses').setValue(x.allHouses);
          this.f().get('houses').setValue(x.houses);
          this.f().get('subject').setValue(x.subject || null);
          this.f().get('body').setValue(x.body || null);
          this.f().get('unread').setValue(x.unread);
        });
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
          multiple: true,
        };
      });
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
        this.messageDetailForm.get('filename').setValue(file.name);
        this.messageDetailForm.get('attachment').setValue(value[0]);
      });
  }

  previewImage(): void {
    alert("to be downloaded");
  }

  backClicked() {
    this.Location.back();
  }

  removeImage(): void {
    this.messageDetailForm.get('filename').setValue(null);
    this.messageDetailForm.get('attachment').setValue(null);
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for message consumption
    console.error(error); // log to console instead
    return throwError(error);
  }

  save(): void {
    this.f().markAllAsTouched();

    if (this.f().valid) {

      const message = <IMessage>{
        allHouses: this.f().get('allHouses').value || false,
        houses: (this.f().get('houses').value || []).map(x => <IHouse>({ _id: x })) || [],
        subject: this.f().get('subject').value,
        body: this.f().get('body').value,
      };

      forkJoin([
        this.HttpClientMessageService.addMessage(message)
      ])
        .pipe(catchError(this.handleError))
        .subscribe(results => {
          this.Router.navigate(['/committee/messages']);
        });
    }
  }
}
