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

export interface IGenre {
  name: string;
}

export interface IBookPayload {
  title: string;
  description: string;
  author: string;
  year: number;
  genres: Types.ObjectId[];
}

export interface IBook extends IBookPayload {
  bookFileName: string;
  thumbnailFileName: string;
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

export interface IQueryParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  author?: string;
  publishedYear?: number;
}
