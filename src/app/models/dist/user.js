"use strict";
exports.__esModule = true;
exports.User = void 0;
var User = /** @class */ (function () {
    function User() {
        this._id = null;
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.username = null;
        this.password = null;
        this.confirmPassword = null;
        this.roles = [];
        this.avatar = null;
    }
    return User;
}());
exports.User = User;
