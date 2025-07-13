import {Request, Response} from 'express';
import User from '../models/User';
import bcrypt from "bcryptjs";

const express = require('express');
export const userRouter = express.Router();

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

userRouter.post('/signup', async (req: Request<SignupRequest>, res: Response) => {
  try {
    const body = req.body;
    
    if (!body.name || !body.email || !body.password) {
      return res.status(411).json({
        message: "Inputs not provided"
      });
    }

    const existingUser = await User.findOne({ email: body.email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET
    );

    return res.json({
      token
    });

  } catch (error: any) {
    console.error('Registration error:', error);

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});


// USER LOGIN ROUTE
// POST /user/login
userRouter.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});
