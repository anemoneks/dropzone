import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CommitteeRoutes } from './committee.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgSelect2Module } from 'ng-select2';
import { HousesComponent } from './houses/houses.component';
import { HouseDetailComponent } from './house-detail/house-detail.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { RolesComponent } from './roles/roles.component';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { BillsComponent } from './bills/bills.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { PaymentsComponent } from './payments/payments.component';
import { UsersComponent } from './users/users.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { ReceiptDetailComponent } from './receipt-detail/receipt-detail.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CommitteeRoutes),
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
    HouseDetailComponent,
    UsersComponent,
    UserDetailComponent,
    RolesComponent,
    RoleDetailComponent,
    BillsComponent,
    BillDetailComponent,
    PaymentsComponent,
    PaymentDetailComponent,
    VisitorsComponent,
    ReceiptsComponent,
    ReceiptDetailComponent,
  ]
})
export class CommitteeModule { }
