"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = require("./routes/user");
const invoiceRouter = require("./routes/invoice");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT;
app.use('/api/v1/user', userRouter);
app.use('/api/v1/invoice', invoiceRouter);
app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
}).on("error", (error) => {
    throw new Error(error.message);
});
