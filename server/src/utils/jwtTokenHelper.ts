import jwt from "jsonwebtoken";
import { IUserTokenPayload } from "../types/type";
import { jwtExpiresIn, jwtSecretKey } from "../config/envconfig";

export const createToken = (userTokenPayload: IUserTokenPayload): string => {
  return jwt.sign(
    userTokenPayload,
    jwtSecretKey,
    {
      expiresIn: jwtExpiresIn,
      algorithm: "HS256",
    }
  );
};
