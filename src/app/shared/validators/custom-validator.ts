import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, debounceTime, take, switchMap } from "rxjs/operators";
import { HttpClientUserService } from "./../../services/http-client-user.service";
import { HttpClientBillService } from "./../../services/http-client-bill.service";
import { IBill } from "./../../interfaces/i-bill";

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value === null || value.length === 0;
}

@Injectable({
  providedIn: "root"
})

export class CustomValidator {
  constructor(
    private HttpClientUserService: HttpClientUserService,
    private HttpClientBillService: HttpClientBillService,
  ) { }

  usernameInUsedValidator(_username: String = ""): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null> => {
      if (isEmptyInputValue(control.value)) {
        return of(null);
      } else if (control.value === _username) {
        return of(null);
      } else {
        return control.valueChanges.pipe(
          debounceTime(500),
          take(1),
          switchMap(_ =>
            this.HttpClientUserService
              .searchUsername(control.value)
              .pipe(
                map(user => {
                  return (user || []).length > 0 ? { usernameInUsed: { value: control.value } } : null;
                })
              )
          )
        );
      }
    };
  }

  mustMatch(matchingControlName: string): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null> => {

      let matchingControl = control.parent.controls[(matchingControlName || '') as string] as AbstractControl;

      if (isEmptyInputValue(control.value)) {
        return of(null);
      } if ((control.value || '') == (matchingControl.value || '')) {
        return of(null);
      } else {
        return of({ mustMatch: { value: control.value } });
      }
    };
  }

  emailInUsedValidator(_email: String = ""): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null> => {
      if (isEmptyInputValue(control.value)) {
        return of(null);
      } else if ((control.value || '').trim().toLowerCase() == (_email || '').trim().toLowerCase()) {
        return of(null);
      } else {
        return control.valueChanges.pipe(
          debounceTime(500),
          take(1),
          switchMap(_ =>
            this.HttpClientUserService
              .searchEmail(control.value)
              .pipe(
                map(user => {
                  return (user || []).length <= 0 ? null : { emailInUsed: { value: control.value } };
                }
                )
              )
          )
        );
      }
    };
  }

  emptyArrayValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null> => {
      return (control.value || []).length > 0 ? of(null) : of({ emptyArray: { value: control.value } });
    };
  }

  compareValidator(controlName: String = ''): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null> => {
      let field = control.parent.controls[(controlName || '') as string] as AbstractControl;
      return (control.value || '').trim().toLowerCase() == (field.value || '').trim().toLowerCase() ? of(null) : of({ compare: { value: control.value } });
    };
  }

  billPeriodValidator(_id: string, _billMonth: number, _billYear: number): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null> => {

      if (_billMonth == null || _billYear == null)
        return of(null);

      return this.HttpClientBillService.getBills().map(bills => {

        const billMonthControl = control.parent.controls['billMonth'] as AbstractControl;
        const billYearControl = control.parent.controls['billYear'] as AbstractControl;

        const filtered = bills.filter(x => {
          if ((_id || '') == '')
            return x.billMonth == +billMonthControl.value && x.billYear == +billYearControl.value;

          return !(x.billMonth == _billMonth && x.billYear == _billYear) && x.billMonth == +billMonthControl.value && x.billYear == +billYearControl.value;
        });
        const validation = filtered.length <= 0 ? null : { billPeriod: { value: control.value } };

        return validation;
      });
    };
  }
}
