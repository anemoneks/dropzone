"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House'
    },
    referenceNo: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    attachment: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    paidDate: {
        type: Date,
        required: true
    },
    createdDate: {
        type: Date,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedDate: {
        type: Date,
        required: true
    },
    updatedBy: {
        type: String,
        required: true
    },
});
exports.Payment = mongoose.model('Payment', schema);
//# sourceMappingURL=Payment.js.map