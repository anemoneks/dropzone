import { Document } from '../../models/document';
import { Component, OnInit, ViewChild, ViewRef, TemplateRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientDocumentService } from '../../services/http-client-document.service';
import { House } from '../../models/house';
import { Router, ActivatedRoute } from '@angular/router';
import { Select2OptionData } from 'ng-Select2';
import { Options } from 'select2';
import { NgbModal, ModalDismissReasons, NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IDocument } from '../../interfaces/i-document';
import { HttpClientHouseService } from '../../services/http-client-house.service';
import { forkJoin } from 'rxjs';
import { FileUpload } from '../../shared/file-upload';
import { Location } from '@angular/common';
import { DocumentType } from '../../enums/document-type.enum';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html'
})
export class DocumentDetailComponent implements OnInit {

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
    private HttpClientDocumentService: HttpClientDocumentService,
    private fileUpload: FileUpload,
  ) { }

  // Bill Form
  public documentDetailForm: FormGroup = this.formBuilder.group(new Document());;

  f(): FormGroup {
    return this.documentDetailForm;
  };

  public get documentTypes(): any {
    return Object.keys(DocumentType)
      .filter(x => {
        return !isNaN(<any>x);
      }).map(x => DocumentType[x]);
  }

  public get documentId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {

    this.f().get('title').setValidators([Validators.required]);
    this.f().get('filename').setValidators([Validators.required]);
    this.f().get('documentType').setValidators([Validators.required]);

    if (this.documentId != '') {
      this.HttpClientDocumentService.getDocument(this.documentId)
        .subscribe(x => {
          this.documentDetailForm.get('_id').setValue(x._id || null);
          this.documentDetailForm.get('title').setValue(x.title || null);
          this.documentDetailForm.get('documentType').setValue(x.documentType);
          this.documentDetailForm.get('filename').setValue(x.filename || null);
          this.documentDetailForm.get('attachment').setValue(x.attachment || null);
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
          multiple: false,
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
        this.documentDetailForm.get('filename').setValue(file.name);
        this.documentDetailForm.get('attachment').setValue(value[0]);
      });
  }

  previewImage(): void {
    alert("to be downloaded");
  }

  backClicked() {
    this.Location.back();
  }

  removeImage(): void {
    this.documentDetailForm.get('filename').setValue(null);
    this.documentDetailForm.get('attachment').setValue(null);
  }

  save(): void {
    this.f().markAllAsTouched();
    if (this.f().valid) {
      const document: IDocument = {
        _id: this.f().get('_id').value,
        title: this.f().get('title').value,
        filename: this.f().get('filename').value,
        attachment: this.f().get('attachment').value,
        documentType: this.f().get('documentType').value,
      } as IDocument;

      if ((document._id || '') == '') {
        this.HttpClientDocumentService.addDocument(document)
          .subscribe(x => {
            this.Router.navigate(['/committee/documents']);
          });
      }
      else {
        this.HttpClientDocumentService.updateDocument(document)
          .subscribe(x => {
            this.Router.navigate(['/committee/documents']);
          });
      }
    }
  }
}
