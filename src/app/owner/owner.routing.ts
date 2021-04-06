import { Routes } from '@angular/router';

import { BillsComponent } from './bills/bills.component';
import { PaymentsComponent } from './payments/payments.component';

export const GuardsRoutes: Routes = [
  {
    path: '',
    children: [
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
