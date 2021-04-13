"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Race = void 0;
const mongoose = require("mongoose");
var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});
exports.Race = mongoose.model('memo', schema);
//# sourceMappingURL=Race.js.map