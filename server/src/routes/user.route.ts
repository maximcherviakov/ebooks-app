import express from "express";
import { info, login, register } from "../controllers/user.controller";
import { createToken } from "../utils/jwtTokenHelper";
import passport from "passport";
import { IUserTokenPayload } from "../types/type";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.get("/info", authenticate, info);

// Local login
router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

// Google auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = createToken({
      userId: (req.user as any)._id,
      username: (req.user as any).displayName,
      email: (req.user as any).emails?.[0].value,
    } as IUserTokenPayload);
    res.redirect(`/auth-success?token=${token}`);
  }
);

export default router;
