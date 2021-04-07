import { Routes } from '@angular/router';

import { HousesComponent } from './houses/houses.component';
import { VisitorDetailComponent } from './visitor-detail/visitor-detail.component';
import { VisitorsComponent } from './visitors/visitors.component';

export const GuardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'houses',
        component: HousesComponent,
        data: {
          title: 'Houses',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'ngHouses' },
          ]
        }
      },
      {
        path: 'visitors',
        component: VisitorsComponent,
        data: {
          title: 'Visitors',
          urls: [
            { title: 'Visitors', url: '/guard/visitors' },
            { title: 'ngVisitors' },
          ]
        }
      },
      {
        path: 'visitors/new',
        component: VisitorDetailComponent,
        data: {
          title: 'Visitor',
          urls: [
            { title: 'Visitor', url: '/guard/visitor' },
            { title: 'ngVisitor' },
          ]
        }
      },
      {
        path: 'visitors/edit/:id',
        component: VisitorDetailComponent,
        data: {
          title: 'Visitor',
          urls: [
            { title: 'Visitor', url: '/guard/visitor' },
            { title: 'ngVisitor' },
          ]
        }
      },
    ]
  }
];
