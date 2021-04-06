"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose = require("mongoose");
var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    permissions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission'
        }],
});
exports.Role = mongoose.model('Role', schema);
//# sourceMappingURL=Role copy.js.map