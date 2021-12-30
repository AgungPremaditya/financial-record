import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { generate, decode } from "../helpers/hash";
import { generateToken } from "../helpers/jwt";

const prisma = new PrismaClient();

export default class UserController {
  static async get(res: Response) {
    const user = await prisma.user.findMany();
    res.status(200).json(user);
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      console.log(req.body);

      const hashPass = generate(password);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashPass,
        },
      });

      res.status(201).json({
        message: `User ${user.name} registered`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        if (decode(password, user.password)) {
          res.status(200).json({
            message: `${user.name} logged in`,
            token: generateToken({
              id: user.id,
              email: user.email,
              name: user.name,
            }),
          });
        } else {
          res.status(401).json({ message: "Invalid email or password!" });
        }
      } else {
        throw { status: 404, message: "User not registered" };
      }
    } catch (error) {
      next(error);
    }
  }
}
