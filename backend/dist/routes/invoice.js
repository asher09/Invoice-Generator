"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRouter = void 0;
const express_1 = __importDefault(require("express"));
const invoiceController_1 = require("../controllers/invoiceController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/generate', auth_1.authenticateToken, invoiceController_1.generateInvoice);
router.get('/all', auth_1.authenticateToken, invoiceController_1.getInvoices);
exports.default = router;
exports.invoiceRouter = router;
