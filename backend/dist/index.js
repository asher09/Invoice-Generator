"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./routes/user");
// import { invoiceRouter } from "./routes/invoice";     
require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
process.env.DEBUG = '';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const PORT = process.env.PORT;
app.use('/api/user', user_1.userRouter);
// app.use('/api/invoice', invoiceRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
exports.default = app;
