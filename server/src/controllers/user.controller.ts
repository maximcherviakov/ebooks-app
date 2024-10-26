import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { createToken } from "../utils/jwtTokenHelper";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();

    const token = createToken({
      userId: user._id.toString(),
    });

    res.status(201).json({ message: "Registration successful", token });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(409).json({ message: "Username or email already exists" });
    } else {
      next(error);
    }
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const token = createToken({
      userId: user._id.toString(),
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};
