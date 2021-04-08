import { Routes } from '@angular/router';

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
import { UsersComponent } from './administration/users/users.component';
import { HousesComponent } from './administration/houses/houses.component';
import { HouseDetailComponent } from './administration/house-detail/house-detail.component';
import { UserDetailComponent } from './administration/user-detail/user-detail.component';
import { BillsComponent } from './administration/bills/bills.component';
import { RolesComponent } from './administration/roles/roles.component';
import { RoleDetailComponent } from './administration/role-detail/role-detail.component';
import { PaymentsComponent } from './administration/payments/payments.component';
import { PaymentsComponent as PersonalPaymentsComponent } from './personal/payments/payments.component';
import { BillsComponent as PersonalBillsComponent } from './personal/bills/bills.component';

export const ComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'progressbar',
        component: NgbdpregressbarBasicComponent,
        data: {
          title: 'Progressbar',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Progressbar' }
          ]
        }
      },
      {
        path: 'card',
        component: CardsComponent,
        data: {
          title: 'Cards',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Cards' }
          ]
        }
      },
      {
        path: 'pagination',
        component: NgbdpaginationBasicComponent,
        data: {
          title: 'Pagination',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Pagination' }
          ]
        }
      },
      {
        path: 'accordion',
        component: NgbdAccordionBasicComponent,
        data: {
          title: 'Accordion',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Accordion' }
          ]
        }
      },
      {
        path: 'alert',
        component: NgbdAlertBasicComponent,
        data: {
          title: 'Alert',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Alert' }
          ]
        }
      },
      {
        path: 'carousel',
        component: NgbdCarouselBasicComponent,
        data: {
          title: 'Carousel',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Carousel' }
          ]
        }
      },
      {
        path: 'datepicker',
        component: NgbdDatepickerBasicComponent,
        data: {
          title: 'Datepicker',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Datepicker' }
          ]
        }
      },
      {
        path: 'dropdown',
        component: NgbdDropdownBasicComponent,
        data: {
          title: 'Dropdown',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Dropdown' }
          ]
        }
      },
      {
        path: 'modal',
        component: NgbdModalBasicComponent,
        data: {
          title: 'Modal',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Modal' }
          ]
        }
      },
      {
        path: 'poptool',
        component: NgbdPopTooltipComponent,
        data: {
          title: 'Popover & Tooltip',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Popover & Tooltip' }
          ]
        }
      },
      {
        path: 'rating',
        component: NgbdratingBasicComponent,
        data: {
          title: 'Rating',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Rating' }
          ]
        }
      },
      {
        path: 'tabs',
        component: NgbdtabsBasicComponent,
        data: {
          title: 'Tabs',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Tabs' }
          ]
        }
      },
      {
        path: 'timepicker',
        component: NgbdtimepickerBasicComponent,
        data: {
          title: 'Timepicker',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Timepicker' }
          ]
        }
      },
      {
        path: 'buttons',
        component: ButtonsComponent,
        data: {
          title: 'Button',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Button' }
          ]
        }
      },
      {
        path: 'toast',
        component: ToastComponent,
        data: {
          title: 'Toast',
        }
      },
      {
        path: 'administration/users',
        component: UsersComponent,
        data: {
          title: 'Users',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Users' }
          ]
        }
      },
      {
        path: 'administration/users/edit/:id',
        component: UserDetailComponent,
        data: {
          title: 'User detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'User detail' }
          ]
        }
      },
      {
        path: 'administration/users/create',
        component: UserDetailComponent,
        data: {
          title: 'User detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'User detail' }
          ]
        }
      },
      {
        path: 'administration/houses',
        component: HousesComponent,
        data: {
          title: 'Houses',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Houses' }
          ]
        }
      },
      {
        path: 'administration/houses/edit/:id',
        component: HouseDetailComponent,
        data: {
          title: 'House detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'House detail' }
          ]
        }
      },
      {
        path: 'administration/houses/create',
        component: HouseDetailComponent,
        data: {
          title: 'House detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'House detail' }
          ]
        }
      },
      {
        path: 'administration/bills',
        component: BillsComponent,
        data: {
          title: 'Bills',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Bills' }
          ]
        }
      },
      {
        path: 'administration/payments',
        component: PaymentsComponent,
        data: {
          title: 'Payments',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Payments' }
          ]
        }
      },
      {
        path: 'personal/payments',
        component: PersonalPaymentsComponent,
        data: {
          title: 'Payments',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Payments' }
          ]
        }
      },
      {
        path: 'personal/bills',
        component: PersonalBillsComponent,
        data: {
          title: 'Bills',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Bills' }
          ]
        }
      },
      {
        path: 'administration/roles',
        component: RolesComponent,
        data: {
          title: 'Roles',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Roles' }
          ]
        }
      },
      {
        path: 'administration/roles/create',
        component: RoleDetailComponent,
        data: {
          title: 'Role detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Role detail' }
          ]
        }
      },
      {
        path: 'administration/roles/edit/:id',
        component: RoleDetailComponent,
        data: {
          title: 'Role detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Role detail' }
          ]
        }
      },
    ]
  }
];
