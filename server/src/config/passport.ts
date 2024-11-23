import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github";
import User from "../models/user.model";
import {
  githubClientId,
  githubClientSecret,
  googleClientId,
  googleClientSecret,
} from "./envconfig";

// Local strategy
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
          return done(null, false, { message: "Invalid email or password" });
        }
        return done(null, user);
      } catch (err) {
        console.log("local:", err);

        return done(err);
      }
    }
  )
);

// Google strategy
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0].value,
            username: profile.displayName,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// GitHub strategy
passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            email: profile.emails?.[0]?.value,
            username: profile.username,
          });
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
