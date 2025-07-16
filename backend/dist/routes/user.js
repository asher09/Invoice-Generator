"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const express = require('express');
exports.userRouter = express.Router();
const signupInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string()
});
const signinInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
exports.userRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { success } = signupInput.safeParse(body);
    if (!success) {
        return res.status(411).json({ message: "Inputs not correct" });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(body.password, 12);
    const user = yield user_1.default.create({
        name: body.name,
        email: body.email,
        password: hashedPassword
    });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.json({
        token
    });
}));
exports.userRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { success } = signinInput.safeParse(body);
    if (!success) {
        return res.status(411).json({ message: "Inputs not correct" });
    }
    const user = yield user_1.default.findOne({
        email: body.email
    });
    if (!user) {
        return res.status(403).json({ message: 'Invalid login credentials' });
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(body.password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({ message: 'Invalid login credentials' });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.json({ token });
}));
