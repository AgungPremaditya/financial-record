import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import TransactionController from "../controllers/transactionControllers";

import UserController from "../controllers/userController";
import WalletController from "../controllers/walletController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Check Status
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Server Connected" });
});

// Auth
router.post("/auth/register", UserController.register);
router.post("/auth/login", UserController.login);

// User
router.get("/user", authenticate, UserController.get);

// Wallet
router.get("/wallet", authenticate, WalletController.get);
router.post("/wallet/create", authenticate, WalletController.post);
router.get("/wallet/:id", authenticate, WalletController.show);
router.put("/wallet/:id", authenticate, WalletController.update);
router.delete("/wallet/:id", authenticate, WalletController.delete);

// Transaction
router.get("/transaction", authenticate, TransactionController.get);
router.post("/transaction", authenticate, TransactionController.create);

export default router;
