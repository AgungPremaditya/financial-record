import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export default class TransactionController {
  static async get(req: Request, res: Response) {
    const user = res.locals.userData;

    const date = new Date();

    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const transaction = await prisma.$queryRaw`select * from "Transaction"
    where "date" >= to_timestamp(${firstDay}, 'YYYY-MM-DD HH:MI:SS')
          and "date" <= to_timestamp(${lastDay}, 'YYYY-MM-DD HH:MI:SS')
          and "userId" = ${user.id}
    order by
          "date" desc ;`;

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

      // update wallet
      try {
        await prisma.wallet.update({
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

      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    // Transaction
    const initTransaction = await prisma.transaction.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        wallet: true,
      },
    });

    if (initTransaction === null) {
      res.sendStatus(404);
    }

    try {
      // set new value
      let tmpValue: number = 0;
      if (initTransaction!.type === "INCOME") {
        tmpValue = initTransaction!.wallet.initValue - initTransaction!.value;
      } else {
        tmpValue = initTransaction!.wallet.initValue + initTransaction!.value;
      }

      await prisma.wallet.update({
        data: {
          initValue: tmpValue,
        },
        where: {
          id: initTransaction!.wallet.id,
        },
      });
    } catch (error) {
      next(error);
    }

    try {
      await prisma.transaction.delete({
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
