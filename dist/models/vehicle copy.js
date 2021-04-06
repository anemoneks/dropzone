"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    plateNo: {
        type: String,
        required: true
    },
});
exports.Vehicle = mongoose.model('Vehicle', schema);
//# sourceMappingURL=vehicle copy.js.map