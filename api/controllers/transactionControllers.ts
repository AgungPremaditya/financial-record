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

  static async show(req: Request, res: Response) {
    const user = res.locals.userData;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: user.id,
      },
      include: {
        wallet: {
          select: {
            name: true,
            accountNumber: true,
          },
        },
      },
    });

    res.status(200).json(transaction);
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.userData;

    const { name, type, date, category, value, detail, walletId } = req.body;

    // get Transaction before
    const initTrans = await prisma.transaction.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: user.id,
      },
      include: {
        wallet: true,
      },
    });

    if (initTrans === null) {
      res.sendStatus(404);
    }

    // set new value
    let tmpValue: number = 0;
    if (initTrans!.type === "INCOME") {
      tmpValue = initTrans!.wallet.initValue - initTrans!.value;
    } else if (initTrans!.type === "EXPENSE") {
      tmpValue = initTrans!.wallet.initValue + initTrans!.value;
    }

    // Update wallet value
    try {
      await prisma.wallet.update({
        data: {
          initValue: tmpValue,
        },
        where: {
          id: initTrans!.walletId,
        },
      });
    } catch (error) {
      next(error);
    }

    // Update transaction
    try {
      const transaction = await prisma.transaction.update({
        data: {
          name,
          type,
          date: new Date(date),
          category,
          value: parseInt(value),
          detail,
          walletId: parseInt(walletId),
        },
        where: {
          id: initTrans!.id,
        },
      });

      const wallet = await prisma.wallet.findFirst({
        where: {
          id: parseInt(walletId),
        },
      });

      if (wallet === null) {
        res.sendStatus(404);
      }

      // set new value
      let newValue: number = 0;
      if (type === "INCOME") {
        newValue = wallet!.initValue + parseInt(value);
      } else {
        newValue = wallet!.initValue - parseInt(value);
      }

      // console.log(newValue);

      let walletTMP = {};
      // update wallet
      try {
        walletTMP = await prisma.wallet.update({
          data: {
            initValue: newValue,
          },
          where: {
            id: parseInt(walletId),
          },
        });
      } catch (error) {
        next(error);
      }

      res.status(200).json({ transaction, walletTMP });
    } catch (error) {
      next(error);
    }
  }
}
