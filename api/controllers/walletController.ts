import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret } from "../helpers/jwt";

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
}
