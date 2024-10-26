import { Types } from "mongoose";
import { Request } from "express";

export interface IUserPayload {
  _id: Types.ObjectId;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends IUserPayload {
  password: string;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export interface IBookPayload {
  title: string;
  description: string;
  author: string;
}

export interface IBook extends IBookPayload {
  bookName: string;
  thumbnailName: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserTokenPayload {
  userId: string;
}

// Define the types for the request object
export interface IAuthRequest extends Request {
  user: IUser;
}

export interface ICommonRequest extends Request {
  user: IUserPayload;
}

export interface ICreateBookRequest extends ICommonRequest {
  body: IBookPayload;
}
