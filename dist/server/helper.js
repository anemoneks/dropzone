"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helper = void 0;
exports.helper = {
    getToken: (headers) => {
        if (headers && headers.authorization) {
            var parted = headers.authorization.split(' ');
            if (parted.length === 2) {
                return parted[1];
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    },
};
//# sourceMappingURL=helper.js.map