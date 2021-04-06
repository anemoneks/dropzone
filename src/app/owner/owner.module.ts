import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { GuardsRoutes } from './owner.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgSelect2Module } from 'ng-select2';
import { PaymentsComponent } from './payments/payments.component';
import { BillsComponent } from './bills/bills.component';

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
    PaymentsComponent,
    BillsComponent,
  ]
})
export class OwnerModule { }
