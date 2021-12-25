import jwt from "jsonwebtoken";
import { secret } from "../config/secret";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, secret, {
    expiresIn: "5h",
  });
};
