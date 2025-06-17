import { Router } from "express";
import { login, logout, register, user } from "../controllers";
import { auth, validator } from "../middlewares";
import { Login, Register } from "../dtos";

const router = Router();

router.post("/login", validator(Login), login);
router.post("/register", validator(Register), register);
router.get("/user", auth, user);
router.post("/logout", auth, logout);

export default router;
