import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { VehicleTypeService } from './vehicleType.service';
import { IVehicleType } from '../interfaces/i-vehicleType';

const cudOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('jwtToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientVehicleTypeService extends VehicleTypeService {

  constructor(private http: HttpClient) {
    super();
  }

  getVehicleTypes(): Observable<IVehicleType[]> {
    return this.http.get<IVehicleType[]>(this.vehicleTypesUrl, cudOptions)
      .pipe(
        // tap(data => console.log(data)), // eyeball results in the console
        catchError(this.handleError)
      );
  }

  // This get-by-id will 404 when id not found
  getVehicleType(id: string): Observable<IVehicleType> {
    const url = `${this.vehicleTypesUrl}/${id}`;
    return this.http.get<IVehicleType>(url, cudOptions).pipe(
      catchError(this.handleError)
    );
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getVehicleType<Data>(id: number): Observable<VehicleType> {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http.get<VehicleType[]>(url)
  //     .map(heroes => heroes[0] as VehicleType)
  //     .catch(this.handleError);
  // }

  addVehicleType(vehicleType: IVehicleType): Observable<IVehicleType> {
    return this.http.post<IVehicleType>(this.vehicleTypesUrl, vehicleType, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteVehicleType(vehicleType: IVehicleType | string): Observable<IVehicleType> {
    const id = typeof vehicleType === 'string' ? vehicleType : vehicleType._id;
    const url = `${this.vehicleTypesUrl}/${id}`;

    return this.http.delete<IVehicleType>(url, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateVehicleType(hero: IVehicleType): Observable<null | IVehicleType> {
    return this.http.put<IVehicleType>(this.vehicleTypesUrl, hero, cudOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for vehicleType consumption
    console.error(error); // log to console instead
    return throwError(error);
  }
}
