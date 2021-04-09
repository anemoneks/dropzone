import { Observable } from 'rxjs';
import { IDashboard } from '../interfaces/i-dashboard';

export abstract class DashboardService {
  dashboardUrl = 'http://localhost:8083/api/dashboard';  // URL to web api

  abstract getDashboard(): Observable<IDashboard[]>;
}
