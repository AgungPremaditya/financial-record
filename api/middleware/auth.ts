import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret } from "../config/secret";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers.authorization;
  if (headers) {
    const token = headers.split(" ")[1];

    jwt.verify(token, secret, (err, user) => {
      if (user === undefined) {
        res.sendStatus(401);
      }
      res.locals.userData = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
