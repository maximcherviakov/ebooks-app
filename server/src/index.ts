import express from "express";
import cors from "cors";
import passport from "passport";
import users from "./routes/user.route";
import books from "./routes/book.route";
import { connectDB } from "./config/db";
import { frontendUrl, port } from "./config/envconfig";
import "./config/passport";

const app = express();

// Configure CORS options (e.g., allow specific origin)
const corsOptions = {
  origin: frontendUrl, // or your frontend URL
  methods: "GET,POST,PUT,DELETE", // Allowed methods
  credentials: true, // Allow cookies and authentication headers
};

// Enable CORS with the configured options
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Initialize Passport middleware
app.use(passport.initialize());

app.use("/api/users", users);
app.use("/api/books", books);

connectDB()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to the server", error);
    }
  })
  .catch((error) => {
    console.log("Invalid database connection...", error);
  });
