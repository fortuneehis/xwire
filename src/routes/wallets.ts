import { Router } from "express";
import { auth, pin, validator } from "../middlewares";
import { deposit, getWallet, transfer, withdraw } from "../controllers";
import { Transfer } from "../dtos";

const router = Router();

router.use(auth);

router.get("/", getWallet);
router.post("/transfer", validator(Transfer), pin, transfer);
router.post("/withdraw", withdraw);
router.post("/deposit", deposit);
export default router;
