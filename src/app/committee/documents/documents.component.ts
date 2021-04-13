import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClientHouseService } from '../../services/http-client-house.service';
import { HttpClientDocumentService } from '../../services/http-client-document.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from '../../shared/file-upload';
import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IHouse } from '../../interfaces/i-house';
import { IDocument } from '../../interfaces/i-document';
import { Options } from 'select2';
import { Select2OptionData } from 'ng-Select2';
import { House } from '../../models/house';
import { DocumentType } from './../../enums/document-type.enum';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html'
})
export class DocumentsComponent implements OnDestroy, OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private HttpClientDocumentService: HttpClientDocumentService,
    private HttpClientHouseService: HttpClientHouseService,
    private modalService: NgbModal,
    private fileUpload: FileUpload) {

  }

  public documentDetailForm: FormGroup;

  paidDate: NgbDateStruct;
  documents: IDocument[] = [];
  selection: SelectionModel<IDocument> = new SelectionModel<IDocument>(true, []);
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  selection2: SelectionModel<IDocument> = new SelectionModel<IDocument>(true, []);
  closeResult: string;
  houses: Observable<IHouse[]> = this.HttpClientHouseService.getHouses();
  selectedRoles: SelectionModel<string> = new SelectionModel<string>(true, []);
  public options: Options;
  public select2Roles: Array<Select2OptionData>;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();

  public get documentTypes() { return DocumentType; }

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
      this.HttpClientDocumentService.getDocuments()
    ]).subscribe(results => {
      this.documents = results[0] || [];
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
    this.documentDetailForm.get('document.paidDate').setValue(new Date(this.paidDate.year, this.paidDate.month - 1, this.paidDate.day));
  }

  changeStatus(document: IDocument): void {
    this.HttpClientHouseService.addDocuments([document])
    .subscribe(x => {
      console.log('updated!');
    });
  }

  handleFileInput(files: FileList) {
    let file = files[0];
    forkJoin([this.fileUpload.toBase64(file)])
      .subscribe(value => {
        (this.documentDetailForm.controls.document as FormGroup).controls.attachment.setValue(value[0]);
        (this.documentDetailForm.controls.document as FormGroup).controls.filename.setValue(file.name);
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

    const deleted = this.selection.selected.map(x => this.HttpClientDocumentService.deleteDocument(x)) || [];
    forkJoin(deleted)
      .subscribe(d => {

        this.documents = this.documents.filter(y => {
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