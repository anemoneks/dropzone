"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserDetailComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var user_1 = require("src/app/models/user");
var collections_1 = require("@angular/cdk/collections");
var UserDetailComponent = /** @class */ (function () {
    function UserDetailComponent(CustomValidator, router, HttpClientRoleService, HttpClientUserService, route, formBuilder) {
        this.CustomValidator = CustomValidator;
        this.router = router;
        this.HttpClientRoleService = HttpClientRoleService;
        this.HttpClientUserService = HttpClientUserService;
        this.route = route;
        this.formBuilder = formBuilder;
        this.userDetailsForm = this.formBuilder.group(new user_1.User());
        this.roles = this.HttpClientRoleService.getRoles();
        this.selectedRoles = new collections_1.SelectionModel(true, []);
    }
    UserDetailComponent.prototype.f = function () {
        return this.userDetailsForm;
    };
    UserDetailComponent.prototype.ngAfterViewInit = function () {
    };
    UserDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        var _id = this.route.snapshot.paramMap.get('id');
        this.f().controls.firstName.setValidators(forms_1.Validators.required);
        this.f().controls.lastName.setValidators(forms_1.Validators.required);
        this.f().controls.email.setValidators([forms_1.Validators.required, forms_1.Validators.email]);
        this.f().controls.username.setValidators([forms_1.Validators.required, forms_1.Validators.minLength(6), forms_1.Validators.pattern('^[a-zA-Z ].*')]);
        this.HttpClientRoleService.getRoles().subscribe(function (users) {
            _this.select2Roles = (users || [])
                .sort(function (a, b) { return a.name.localeCompare(b.name); })
                .map(function (u) {
                return {
                    id: u._id.toString(),
                    text: u.name
                };
            });
            _this.options = {
                width: '100%',
                multiple: true
            };
        });
        if (_id) {
            this.HttpClientUserService.getUser(_id)
                .subscribe(function (x) {
                _this.f().controls._id.setValue(x[0]._id || '');
                _this.f().controls.firstName.setValue(x[0].firstName || '');
                _this.f().controls.lastName.setValue(x[0].lastName || '');
                _this.f().controls.email.setValue(x[0].email || '');
                _this.f().controls.username.setValue(x[0].username || '');
                _this.f().controls.password.setValue('');
                _this.f().controls.roles.setValue(x[0].roles || []);
                _this.f().controls.avatar.setValue({});
                _this.f().controls.email.setAsyncValidators(_this.CustomValidator.emailInUsedValidator(x[0].email || ''));
                _this.f().controls.username.setAsyncValidators(_this.CustomValidator.usernameInUsedValidator(x[0].username || ''));
                _this.f().controls.password.setValidators([forms_1.Validators.minLength(6)]);
                (x.roles || []).forEach(function (r) {
                    _this.selectedRoles.select(r._id);
                });
            });
        }
        else {
            this.f().controls.email.setAsyncValidators(this.CustomValidator.emailInUsedValidator(''));
            this.f().controls.username.setAsyncValidators(this.CustomValidator.usernameInUsedValidator(''));
            this.f().controls.password.setValidators([forms_1.Validators.required, forms_1.Validators.minLength(6)]);
        }
        this.f().controls.password.setAsyncValidators(this.CustomValidator.mustMatch('confirmPassword'));
        this.f().controls.confirmPassword.setAsyncValidators(this.CustomValidator.mustMatch('password'));
        this.f().get('confirmPassword').valueChanges.subscribe(function () {
            _this.f().get('password').updateValueAndValidity({ emitEvent: false });
        });
        this.f().get('password').valueChanges.subscribe(function () {
            _this.f().get('confirmPassword').updateValueAndValidity({ emitEvent: false });
        });
    };
    UserDetailComponent.prototype.onFileChange = function (event) {
        var _this = this;
        var reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            var file_1 = event.target.files[0];
            reader.readAsDataURL(file_1);
            reader.onload = function () {
                var avatar = {
                    filename: file_1.name,
                    filetype: file_1.type,
                    value: reader.result.toString().split(',')[1]
                };
                _this.f().get('avatar').setValue(avatar);
            };
        }
        else {
            this.f().controls.avatar.setValue({});
        }
    };
    UserDetailComponent.prototype.save = function () {
        var _this = this;
        if (this.f().valid) {
            var user = {
                _id: this.f().get('_id').value,
                firstName: this.f().get('firstName').value || '',
                lastName: this.f().get('lastName').value || '',
                email: this.f().get('email').value || '',
                username: this.f().get('username').value || '',
                password: this.f().get('password').value || '',
                roles: this.f().get('roles').value || '',
                avatar: this.f().get('avatar').value || {}
            };
            if (user._id) {
                this.HttpClientUserService.updateUser(user)
                    .subscribe(function (x) {
                    _this.router.navigate(['/component/administration/users']);
                });
            }
            else {
                this.HttpClientUserService.addUser(user)
                    .subscribe(function (x) {
                    _this.router.navigate(['/component/administration/users']);
                });
            }
        }
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], UserDetailComponent.prototype, "fileInput");
    UserDetailComponent = __decorate([
        core_1.Component({
            selector: 'app-user-detail',
            templateUrl: './user-detail.component.html'
        })
    ], UserDetailComponent);
    return UserDetailComponent;
}());
exports.UserDetailComponent = UserDetailComponent;
