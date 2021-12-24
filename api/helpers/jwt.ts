import jwt from "jsonwebtoken";

export const secret = process.env.JWTSECRET ?? "123456789secret";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, secret);
};
