import { Router } from "express";
import { Request, Response, NextFunction } from "express";

import User from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Check Status
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Server Connected" });
});

// Auth
router.post("/auth/register", User.register);
router.post("/auth/login", User.login);

// User
router.get("/user", authenticate, User.get);

export default router;
