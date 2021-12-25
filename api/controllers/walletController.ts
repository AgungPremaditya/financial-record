import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export default class WalletController {
  static async get(req: Request, res: Response) {
    const user = res.locals.userData;

    const wallet = await prisma.wallet.findMany({
      where: {
        userId: user.id,
      },
    });

    res.status(200).json(wallet);
  }

  static async post(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.userData;

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

  static async show(req: Request, res: Response) {
    const user = res.locals.userData;
    const id = req.params.id;

    const wallet = await prisma.wallet.findFirst({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    if (wallet === null) {
      res.sendStatus(404);
    }

    res.status(200).json(wallet);
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    try {
      const { name, accountNumber, type, initValue } = req.body;

      const wallet = await prisma.wallet.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
          accountNumber,
          type,
          initValue,
        },
      });

      res.status(200).json(wallet);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    try {
      await prisma.wallet.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.status(200).json({ message: `Data ${id} deleted` });
    } catch (error) {
      next(error);
    }
  }
}
