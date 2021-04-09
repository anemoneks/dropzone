import { Routes } from '@angular/router';

import { BillsComponent } from './bills/bills.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const OwnerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngPayments' },
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
            { title: 'ngPayments' },
          ]
        }
      },
      {
        path: 'payments/new',
        component: PaymentDetailComponent,
        data: {
          title: 'Payment',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngPayments' },
          ]
        }
      },
      {
        path: 'payments/edit/:id',
        component: PaymentDetailComponent,
        data: {
          title: 'Payment',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngPayments' },
          ]
        }
      },
      {
        path: 'Bills',
        component: BillsComponent,
        data: {
          title: 'Bills',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngBills' },
          ]
        }
      },
    ]
  }
];
