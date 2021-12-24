import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export default class WalletController {
  static async get(req: Request, res: Response) {
    const user = res.locals.user;

    const wallet = await prisma.wallet.findMany({
      where: {
        userId: user.id,
      },
    });

    res.status(200).json(wallet);
  }

  static async post(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;

    try {
      const { name, accountNumber, type, initValue } = req.body;

      const wallet = await prisma.wallet.create({
        data: {
          name,
          accountNumber,
          type,
          initValue: parseInt(initValue),
          userId: user.id,
        },
      });

      res.status(200).json(wallet);
    } catch (error) {
      next(error);
    }
  }
}
