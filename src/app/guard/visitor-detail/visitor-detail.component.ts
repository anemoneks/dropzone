import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IVisitor } from './../../interfaces/i-visitor';
import { Visitor } from './../../models/visitor';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientVisitorService } from './../../services/http-client-visitor.service';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Options } from 'select2';
import { Select2OptionData } from 'ng-Select2';

@Component({
  selector: 'app-visitor-detail',
  templateUrl: './visitor-detail.component.html'
})
export class VisitorDetailComponent implements AfterViewInit, OnInit {
  visitorDetailsForm: FormGroup = this.formBuilder.group(new Visitor());
  visitors: Observable<IVisitor[]> = this.HttpClientVisitorService.getVisitors();
  selectedVisitors: SelectionModel<string> = new SelectionModel<string>(true, []);
  public options: Options;
  public select2Visitors: Array<Select2OptionData>;

  constructor(
    private router: Router,
    private HttpClientVisitorService: HttpClientVisitorService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  f(): FormGroup {
    return this.visitorDetailsForm;
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    const _id = this.route.snapshot.paramMap.get('id');
    this.f().controls.firstName.setValidators(Validators.required);
    this.f().controls.lastName.setValidators(Validators.required);
    this.f().controls.gender.setValidators(Validators.required);
    if (_id) {
      this.HttpClientVisitorService.getVisitor(_id)
        .subscribe(x => {
          this.f().controls._id.setValue(x._id || '');
          this.f().controls.firstName.setValue(x.firstName || '');
          this.f().controls.lastName.setValue(x.lastName || '');
          this.f().controls.gender.setValue(x.gender || '');
        });
    }
    else {

    }
  }

  save(): void {
    if (this.f().valid) {
      const visitor: IVisitor = {
        _id: this.f().get('_id').value,
        firstName: this.f().get('firstName').value,
        lastName: this.f().get('lastName').value,
        gender: this.f().get('gender').value,
      } as Visitor;

      if (visitor._id) {
        this.HttpClientVisitorService.updateVisitor(visitor)
          .subscribe(x => {
            this.router.navigate(['/guard/visitors']);
          });
      }
      else {
        this.HttpClientVisitorService.addVisitor(visitor)
          .subscribe(x => {
            this.router.navigate(['/guard/visitors']);
          });
      }
    }
  }
}
