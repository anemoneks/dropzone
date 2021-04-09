import { Routes } from '@angular/router'
import { HouseDetailComponent } from './house-detail/house-detail.component';
import { HousesComponent } from './houses/houses.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { BillsComponent } from './bills/bills.component';
import { VisitorsComponent } from '../guard/visitors/visitors.component';
import { RolesComponent } from '../component/administration/roles/roles.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { ReceiptDetailComponent } from './receipt-detail/receipt-detail.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';

export const CommitteeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
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
        path: 'users/edit/:id',
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
        path: 'users/create',
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
        path: 'houses',
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
        path: 'payments/new',
        component: PaymentDetailComponent,
        data: {
          title: 'Payment Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Payments' }
          ]
        }
      },
      {
        path: 'payments/edit/:id',
        component: PaymentDetailComponent,
        data: {
          title: 'Payment Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Payments' }
          ]
        }
      },
      {
        path: 'houses/edit/:id',
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
        path: 'houses/create',
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
        path: 'bills',
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
        path: 'bills/new',
        component: BillDetailComponent,
        data: {
          title: 'Bill Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Bills' }
          ]
        }
      },
      {
        path: 'bills/edit/:id',
        component: BillDetailComponent,
        data: {
          title: 'Bill Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Bills' }
          ]
        }
      },
      {
        path: 'payments',
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
        path: 'roles',
        component: RolesComponent,
        data: {
          title: 'Roles',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngRoles' },
          ]
        }
      },
      {
        path: 'visitors',
        component: VisitorsComponent,
        data: {
          title: 'Visitors',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngVisitors' },
          ]
        }
      },
      {
        path: 'receipts',
        component: ReceiptsComponent,
        data: {
          title: 'Receipts',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Payments' }
          ]
        }
      },
      {
        path: 'receipts/new',
        component: ReceiptDetailComponent,
        data: {
          title: 'Receipt Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Receipts' }
          ]
        }
      },
      {
        path: 'receipts/edit/:id',
        component: ReceiptDetailComponent,
        data: {
          title: 'Receipt Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngComponent' },
            { title: 'Receipts' }
          ]
        }
      },
    ]
  }
];
