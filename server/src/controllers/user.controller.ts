import { Request, Response } from "express";
import User from "../models/user.model";
import { createToken } from "../utils/jwtTokenHelper";
import { IAuthRequest } from "../types/type";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email is already registered" });
      return;
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = createToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    res.status(201).json({ token });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(409).json({ message: "Username or email already exists" });
    } else {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const login = async (req: IAuthRequest, res: Response) => {
  console.log("login:", req.user);

  const username = req.user?.username;
  const email = req.user?.email;
  const token = createToken({
    userId: req.user?._id.toString(),
    username,
    email,
  });
  res.json({ token });
};

export const info = async (req: IAuthRequest, res: Response) => {
  res.json(req.user);
};
