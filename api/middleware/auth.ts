import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret } from "../helpers/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers.authorization;
  if (headers) {
    const token = headers.split(" ")[1];

    jwt.verify(token, secret, () => {
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
