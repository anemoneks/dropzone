import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { ComponentsRoutes } from './component.routing';
import { NgbdpregressbarBasicComponent } from './progressbar/progressbar.component';
import { NgbdpaginationBasicComponent } from './pagination/pagination.component';
import { NgbdAccordionBasicComponent } from './accordion/accordion.component';
import { NgbdAlertBasicComponent } from './alert/alert.component';
import { NgbdCarouselBasicComponent } from './carousel/carousel.component';
import { NgbdDatepickerBasicComponent } from './datepicker/datepicker.component';
import { NgbdDropdownBasicComponent } from './dropdown-collapse/dropdown-collapse.component';
import { NgbdModalBasicComponent } from './modal/modal.component';
import { NgbdPopTooltipComponent } from './popover-tooltip/popover-tooltip.component';
import { NgbdratingBasicComponent } from './rating/rating.component';
import { NgbdtabsBasicComponent } from './tabs/tabs.component';
import { NgbdtimepickerBasicComponent } from './timepicker/timepicker.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { CardsComponent } from './card/card.component';
import { ToastComponent } from './toast/toast.component';
import { ToastsContainer } from './toast/toast-container';
import { UsersComponent } from './administration/users/users.component';
import { HousesComponent } from './administration/houses/houses.component';
import { HouseDetailComponent } from './administration/house-detail/house-detail.component';
import { UserDetailComponent } from './administration/user-detail/user-detail.component';
import { NgSelect2Module } from 'ng-select2';
import { DataTablesModule } from 'angular-datatables';
import { BillsComponent } from './administration/bills/bills.component';
import { RolesComponent } from './administration/roles/roles.component';
import { RoleDetailComponent } from './administration/role-detail/role-detail.component';
import { PaymentsComponent } from './administration/payments/payments.component';
import { PaymentsComponent as PersonalPaymentsComponent } from './personal/payments/payments.component';
import { PaymentDetailComponent } from './administration/payment-detail/payment-detail.component';
import { BillsComponent as PersonalBillsComponent } from './personal/bills/bills.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelect2Module,
    DataTablesModule,
    NgbModalModule,
    NgbDatepickerModule,
  ],
  declarations: [
    NgbdpregressbarBasicComponent,
    NgbdpaginationBasicComponent,
    NgbdAccordionBasicComponent,
    NgbdAlertBasicComponent,
    NgbdCarouselBasicComponent,
    NgbdDatepickerBasicComponent,
    NgbdDropdownBasicComponent,
    NgbdModalBasicComponent,
    NgbdPopTooltipComponent,
    NgbdratingBasicComponent,
    NgbdtabsBasicComponent,
    NgbdtimepickerBasicComponent,
    ButtonsComponent,
    CardsComponent,
    ToastComponent,
    ToastsContainer,
    UsersComponent,
    HousesComponent,
    HouseDetailComponent,
    UserDetailComponent,
    BillsComponent,
    RolesComponent,
    RoleDetailComponent,
    PaymentsComponent,
    PaymentDetailComponent,
    PaymentsComponent,
    PersonalPaymentsComponent,
    PersonalBillsComponent,
  ]
})
export class ComponentsModule { }
