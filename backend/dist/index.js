"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./db");
const user_1 = require("./routes/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = require('express');
app.route('/api/user', user_1.userRouter);
// app.route('/api/invoice', invoiceRouter);
exports.default = app;
