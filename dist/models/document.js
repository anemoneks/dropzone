"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const mongoose = require("mongoose");
var schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdDate: {
        type: Date,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedDate: {
        type: Date,
        required: true
    },
});
exports.Document = mongoose.model('Document', schema);
//# sourceMappingURL=document.js.map