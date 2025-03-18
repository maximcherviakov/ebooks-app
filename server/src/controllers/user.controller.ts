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
      console.error("Registration error:", error);
      res.status(409).json({ message: "Username or email already exists" });
    } else {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const login = async (req: IAuthRequest, res: Response) => {
  console.log("login:", req.user);
  if (!req.user) {
    res.status(401).json({ message: "Authentication failed" });
    return;
  }

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

export const resetPassword = async (req: IAuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ message: "Current and new password are required" });
      return;
    }

    if (newPassword.length < 6) {
      res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if the user is authenticated via any third-party provider
    // This checks for any field that indicates third-party authentication
    if (user.googleId) {
      res.status(403).json({
        message:
          "Password reset is not available for accounts using third-party authentication",
      });
      return;
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Current password is incorrect" });
      return;
    }

    // Update password
    user.password = newPassword; // The password will be hashed in the pre-save hook
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
