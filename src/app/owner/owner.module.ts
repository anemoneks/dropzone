import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { OwnerRoutes } from './owner.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgSelect2Module } from 'ng-select2';
import { PaymentsComponent } from './payments/payments.component';
import { BillsComponent } from './bills/bills.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(OwnerRoutes),
    NgbModule,
    NgSelect2Module,
    DataTablesModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ],
  declarations: [
    PaymentsComponent,
    BillsComponent,
    PaymentDetailComponent,
    DashboardComponent,
  ],
})
export class OwnerModule { }
