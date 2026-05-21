import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { HTTPSTATUS } from "../config/http.config";
import {
  googleLoginCallback,
  loginController,
  logOutController,
  registerUserController,
} from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);

authRoutes.post("/logout", logOutController);

authRoutes.get(
  "/google",
  (req, res, next) => {
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
      res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Google OAuth is not configured on this server.",
      });
      return;
    }
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRoutes.get(
  "/google/callback",
  (req, res, next) => {
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
      res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Google OAuth is not configured on this server.",
      });
      return;
    }
    next();
  },
  passport.authenticate("google", {
    failureRedirect: failedUrl,
  }),
  googleLoginCallback
);

export default authRoutes;
