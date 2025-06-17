import { Router } from "express";
import { auth } from "../middlewares";
import { getAllTransactions } from "../controllers";

const router = Router();

router.use(auth);

router.get("/", getAllTransactions);

export default router;
