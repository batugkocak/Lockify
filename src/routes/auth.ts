import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth";
import { Request, Response } from "express";

const router: Router = Router();

router.post("/register", (req: Request, res: Response) => createUser(req, res));

router.post("/login", (req: Request, res: Response) => loginUser(req, res));

export default router;
