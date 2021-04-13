"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentType = void 0;
const mongoose = require("mongoose");
var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});
exports.DocumentType = mongoose.model('DocumentType', schema);
//# sourceMappingURL=documentType.js.map