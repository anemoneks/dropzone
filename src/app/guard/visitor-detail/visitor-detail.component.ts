import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IVisitor } from './../../interfaces/i-visitor';
import { Visitor } from './../../models/visitor';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientVisitorService } from './../../services/http-client-visitor.service';
import { HttpClientHouseService } from './../../services/http-client-house.service';
import { HttpClientRaceService } from './../../services/http-client-race.service';
import { HttpClientVehicleTypeService } from './../../services/http-client-vehicleType.service';
import { HttpClientVisitingPurposeService } from './../../services/http-client-visitingPurpose.service';
import { forkJoin, Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Options } from 'select2';
import { Select2OptionData } from 'ng-Select2';
import { House } from 'src/app/models/house';
import { Race } from 'src/app/models/race';
import { IRace } from 'src/app/interfaces/i-race';
import { IVisitingPurpose } from 'src/app/interfaces/i-visitingPurpose';
import { IVehicleType } from 'src/app/interfaces/i-vehicleType';
import { VehicleType } from 'src/app/models/vehicleType';

@Component({
  selector: 'app-visitor-detail',
  templateUrl: './visitor-detail.component.html'
})

export class VisitorDetailComponent implements AfterViewInit, OnInit {

  visitorDetailsForm: FormGroup = this.formBuilder.group(
    {
      house: this.formBuilder.group({
        houses: Array<string>(),
      } as any),
      visitor: this.formBuilder.group(new Visitor()),
    }
  );
  visitors: Observable<IVisitor[]> = this.HttpClientVisitorService.getVisitors();
  selectedVisitors: SelectionModel<string> = new SelectionModel<string>(true, []);

  public options: Options;
  public select2Houses: Array<Select2OptionData>;
  public races: Array<IRace> = new Array<IRace>();
  public visitingPurposes: Array<IVisitingPurpose> = new Array<IVisitingPurpose>();
  public vehicleTypes: Array<IVehicleType> = new Array<IVehicleType>();

  constructor(
    private router: Router,
    private HttpClientVisitorService: HttpClientVisitorService,
    private HttpClientHouseService: HttpClientHouseService,
    private HttpClientRaceService: HttpClientRaceService,
    private HttpClientVehicleTypeService: HttpClientVehicleTypeService,
    private HttpClientVisitingPurposeService: HttpClientVisitingPurposeService,
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

    this.f().get('visitor.firstName').setValidators([Validators.required]);
    this.f().get('visitor.lastName').setValidators([Validators.required]);
    this.f().get('visitor.vehicleNo').setValidators([Validators.required]);
    this.f().get('visitor.gender').setValidators([Validators.required]);
    this.f().get('visitor.raceId').setValidators([Validators.required]);
    this.f().get('visitor.houseId').setValidators([Validators.required]);
    this.f().get('visitor.vehicleTypeId').setValidators([Validators.required]);
    this.f().get('visitor.visitingPurposeId').setValidators([Validators.required]);

    forkJoin([
      this.HttpClientHouseService.getHouses(),
      this.HttpClientRaceService.getRaces(),
      this.HttpClientVehicleTypeService.getVehicleTypes(),
      this.HttpClientVisitingPurposeService.getVisitingPurposes(),
    ]).subscribe(r => {

      const mapped = (r[0] || []).map(h => {
        return new House(h);
      }) || [];

      this.select2Houses = mapped.sort((a, b) => {
        return a.address().localeCompare(b.address());
      })
        .map(u => {
          return {
            id: u._id.toString(),
            text: u.address(),
          } as Select2OptionData;
        });

      // races
      this.races = (r[1] || []).map(x => {
        return new Race(x);
      }) || [];

      this.options = {
        width: '100%',
        allowClear: true,
        multiple: true,
        maximumSelectionLength: 1,
      };

      this.vehicleTypes = (r[2] || []).map(x => {
        return new VehicleType(x);
      });

      // visiting purposes
      this.visitingPurposes = r[3] || [];

      console.log(this.visitingPurposes);
    });

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

  onHouseChanged(houses: any) {
    const selected = ((houses as Array<string>) || []);
    if (selected.length > 0) {
      this.f().get('visitor.houseId').setValue(selected[0]);
    }
    else {
      this.f().get('visitor.houseId').setValue(null);
    }
  }

  save(): void {
    this.f().markAllAsTouched();
    if (this.f().valid) {
      const visitor: IVisitor = {
        _id: this.f().get('visitor._id').value,
        firstName: this.f().get('visitor.firstName').value,
        lastName: this.f().get('visitor.lastName').value,
        vehicleNo: this.f().get('visitor.vehicleNo').value,
        gender: this.f().get('visitor.gender').value,
        raceId: this.f().get('visitor.raceId').value,
        vehicleTypeId: this.f().get('visitor.vehicleTypeId').value,
        houseId: this.f().get('visitor.houseId').value,
        visitingPurposeId: this.f().get('visitor.visitingPurposeId').value,
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
