"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
/**
 * API ROUTES
 */
const express = require("express");
exports.api = express();
exports.api.get('/', (req, res) => {
    res.send({ hello: 'world' });
});
//# sourceMappingURL=routes.js.map