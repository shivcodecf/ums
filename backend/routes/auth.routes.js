import express from "express";
import { login, logout, signup } from "../controllers/auth.controllers.js";

const router = express.Router();

router.route("/login").post(login);

router.route("/register").post(signup);

router.route("/logout").post(logout);

export default router;
