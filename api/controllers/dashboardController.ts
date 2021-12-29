import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export default class DasboardController {
  static async get(req: Request, res: Response) {
    const user = res.locals.userData;

    const income = await prisma.transaction.groupBy({
      by: ["date"],
      where: {
        userId: user.id,
        type: "INCOME",
      },
      _sum: {
        value: true,
      },
    });

    const expense = await prisma.transaction.groupBy({
      by: ["date"],
      where: {
        type: "EXPENSE",
      },
      _sum: {
        value: true,
      },
    });

    const data = {
      income,
      expense,
    };

    res.status(200).json({ income, expense });
  }
}
