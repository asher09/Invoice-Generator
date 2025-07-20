import {Request, Response} from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {z} from 'zod'
import {connectDB} from  '../db'

const {User} =require('../models/user');

const express = require('express');
export const userRouter = express.Router();

const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string()
})

const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

userRouter.post('/signup', async (req: Request, res: Response) => {
  const body = req.body;
  const {success} = signupInput.safeParse(body);
  if(!success) {
    return res.status(411).json({message: "Inputs not correct"})
  }

  const hashedPassword = await bcrypt.hash(body.password, 12);
  const user = await User.create({
    name: body.name,
    email: body.email,
    password: hashedPassword
  })

  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!)

  return res.json({
    token
  })
})



userRouter.post('/signin', async (req: Request, res: Response) => {
  const body = req.body;
  const {success} = signinInput.safeParse(body);
  if(!success) {
    return res.status(411).json({message: "Inputs not correct"})
  }

  const user = await User.findOne({
    email: body.email
  })

  if(!user) {
    return res.status(403).json({message: 'Invalid login credentials'})
  }

  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if(!isPasswordValid) {
    return res.status(403).json({message: 'Invalid login credentials'})
  }

  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!)
  
  return res.json({token})
})
