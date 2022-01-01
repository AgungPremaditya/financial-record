import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export default class DasboardController {
  static async get(req: Request, res: Response) {
    const user = res.locals.userData;

    const date = new Date();

    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1 + 1)
      .toISOString()
      .split("T")[0];
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1)
      .toISOString()
      .split("T")[0];

    console.log(firstDay, lastDay);

    const income = await prisma.$queryRaw`select
        "date",
        sum(value) as total
      from
        "Transaction"
      where
        "type" = 'INCOME'
        and "date" >= to_timestamp(${firstDay}, 'YYYY-MM-DD HH:MI:SS')
        and "date" <= to_timestamp(${lastDay}, 'YYYY-MM-DD HH:MI:SS')
      group by
        "date"
      order by
        "date";`;

    const expense = await prisma.$queryRaw`select
        "date",
        sum(value) as total
      from
        "Transaction"
      where
        "type" = 'EXPENSE'
        and "date" >= to_timestamp(${firstDay}, 'YYYY-MM-DD HH:MI:SS')
        and "date" <= to_timestamp(${lastDay}, 'YYYY-MM-DD HH:MI:SS')
      group by
        "date"
      order by
        "date";`;

    const data = { income, expense };

    res.status(200).json(data);
  }
}
