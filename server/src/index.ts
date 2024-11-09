import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import users from "./routes/user.route.js";
import books from "./routes/book.route.js";
import { frontendUrl, port } from "./config/envconfig.js";

const app = express();

app.use(express.json());

// Configure CORS options (e.g., allow specific origin)
const corsOptions = {
  origin: frontendUrl, // or your frontend URL
  methods: "GET,POST,PUT,DELETE", // Allowed methods
  credentials: true, // Allow cookies and authentication headers
};

// Enable CORS with the configured options
app.use(cors(corsOptions));

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
