"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
const mongoose = require("mongoose");
var schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    documents: [{
            type: String,
            required: true
        }],
});
exports.Visitor = mongoose.model('Visitor', schema);
//# sourceMappingURL=visitor.js.map