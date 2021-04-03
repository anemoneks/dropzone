"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CustomValidator = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function isEmptyInputValue(value) {
    // we don't check for string here so it also works with arrays
    return value === null || value.length === 0;
}
var CustomValidator = /** @class */ (function () {
    function CustomValidator(HttpClientUserService) {
        this.HttpClientUserService = HttpClientUserService;
    }
    CustomValidator.prototype.usernameInUsedValidator = function (_username) {
        var _this = this;
        if (_username === void 0) { _username = ""; }
        return function (control) {
            if (isEmptyInputValue(control.value)) {
                return rxjs_1.of(null);
            }
            else if (control.value === _username) {
                return rxjs_1.of(null);
            }
            else {
                return control.valueChanges.pipe(operators_1.debounceTime(500), operators_1.take(1), operators_1.switchMap(function (_) {
                    return _this.HttpClientUserService
                        .searchUsername(control.value)
                        .pipe(operators_1.map(function (user) {
                        return (user || []).length > 0 ? { usernameInUsed: { value: control.value } } : null;
                    }));
                }));
            }
        };
    };
    CustomValidator.prototype.mustMatch = function (matchingControlName) {
        return function (control) {
            var matchingControl = control.parent.controls[(matchingControlName || '')];
            if (isEmptyInputValue(control.value)) {
                return rxjs_1.of(null);
            }
            if ((control.value || '') == (matchingControl.value || '')) {
                return rxjs_1.of(null);
            }
            else {
                return rxjs_1.of({ mustMatch: { value: control.value } });
            }
        };
    };
    CustomValidator.prototype.emailInUsedValidator = function (_email) {
        var _this = this;
        if (_email === void 0) { _email = ""; }
        return function (control) {
            if (isEmptyInputValue(control.value)) {
                return rxjs_1.of(null);
            }
            else if ((control.value || '').trim().toLowerCase() == (_email || '').trim().toLowerCase()) {
                return rxjs_1.of(null);
            }
            else {
                return control.valueChanges.pipe(operators_1.debounceTime(500), operators_1.take(1), operators_1.switchMap(function (_) {
                    return _this.HttpClientUserService
                        .searchEmail(control.value)
                        .pipe(operators_1.map(function (user) {
                        return (user || []).length <= 0 ? null : { emailInUsed: { value: control.value } };
                    }));
                }));
            }
        };
    };
    CustomValidator.prototype.emptyArrayValidator = function () {
        return function (control) {
            return (control.value || []).length > 0 ? rxjs_1.of(null) : rxjs_1.of({ emptyArray: { value: control.value } });
        };
    };
    CustomValidator.prototype.compareValidator = function (controlName) {
        if (controlName === void 0) { controlName = ''; }
        return function (control) {
            var field = control.parent.controls[(controlName || '')];
            return (control.value || '').trim().toLowerCase() == (field.value || '').trim().toLowerCase() ? rxjs_1.of(null) : rxjs_1.of({ compare: { value: control.value } });
        };
    };
    CustomValidator.prototype.billPeriodValidator = function (bills, _id, _billMonth, _billYear) {
        if (bills === void 0) { bills = []; }
        return function (control) {
            if (_billMonth == null || _billYear == null)
                return rxjs_1.of(null);
            var billMonthControl = control.parent.controls['billMonth'];
            var billYearControl = control.parent.controls['billYear'];
            var filtered = bills.filter(function (x) {
                if ((_id || '') == '')
                    return x.billMonth == +billMonthControl.value && x.billYear == +billYearControl.value;
                return !(x.billMonth == _billMonth && x.billYear == _billYear) && x.billMonth == +billMonthControl.value && x.billYear == +billYearControl.value;
            });
            var validation = filtered.length <= 0 ? null : { billPeriod: { value: control.value } };
            return rxjs_1.of(validation);
        };
    };
    CustomValidator = __decorate([
        core_1.Injectable({
            providedIn: "root"
        })
    ], CustomValidator);
    return CustomValidator;
}());
exports.CustomValidator = CustomValidator;
