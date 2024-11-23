import express from "express";
import { login, register } from "../controllers/user.controller";
import { createToken } from "../utils/jwtTokenHelper";
import passport from "passport";
import { IUserTokenPayload } from "../types/type";

const router = express.Router();

// Local login
router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

// Google auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = createToken(req.user as IUserTokenPayload);
    res.redirect(`/auth-success?token=${token}`);
  }
);

// GitHub auth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = createToken(req.user as IUserTokenPayload);
    res.redirect(`/auth-success?token=${token}`);
  }
);

export default router;
