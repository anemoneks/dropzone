import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { GuardsRoutes } from './guard.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgSelect2Module } from 'ng-select2';
import { HousesComponent } from './houses/houses.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { VisitorDetailComponent } from './visitor-detail/visitor-detail.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(GuardsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelect2Module,
    DataTablesModule,
    NgbModalModule,
    NgbDatepickerModule,
  ],
  declarations: [
    HousesComponent,
    VisitorsComponent,
    VisitorDetailComponent,
  ]
})
export class GuardsModule { }
