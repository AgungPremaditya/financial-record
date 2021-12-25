import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export default class TransactionController {
  static async get(req: Request, res: Response) {
    const user = res.locals.userData;

    const transaction = await prisma.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(transaction);
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.userData;

    const { name, type, date, category, value, detail, walletId } = req.body;

    try {
      const transaction = await prisma.transaction.create({
        data: {
          name,
          type,
          date: new Date(date),
          category,
          detail,
          value: parseInt(value),
          userId: user.id,
          walletId: parseInt(walletId),
        },
      });

      const wallet = await prisma.wallet.findFirst({
        where: {
          id: parseInt(walletId),
        },
      });

      if (type === "INCOME") {
        await prisma.wallet.update({
          where: {
            id: parseInt(walletId),
          },
          data: {
            initValue: wallet!.initValue + parseInt(value),
          },
        });
      } else {
        await prisma.wallet.update({
          where: {
            id: parseInt(walletId),
          },
          data: {
            initValue: wallet!.initValue - parseInt(value),
          },
        });
      }

      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }
}
