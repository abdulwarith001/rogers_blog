import { Router } from "express";
import { login, register } from "../controllers/auth.js";
const router = Router()
import { validateRegister, validateLogin } from "../middlewares/validateMiddleware.js";

router.post('/login', login)
router.post('/register',validateRegister, register)

export default router