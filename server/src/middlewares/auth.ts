import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IAuthRequest, IUserTokenPayload } from "../types/type";
import User from "../models/user.model";
import { jwtSecretKey } from "../config/envconfig";

export const authenticate = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Not authorized, token missing." });
    return;
  }

  try {
    // Verify token
    const decodedUserPayload = jwt.verify(
      token,
      jwtSecretKey
    ) as IUserTokenPayload;    

    // Attach user to request
    const user = await User.findById(decodedUserPayload.userId).select(
      "-password"
    );
    if (!user) {
      res.status(401).json({ message: "Not authorized, user not found." });
      return;
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token." });
  }
};
