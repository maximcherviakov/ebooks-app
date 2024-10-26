import express from "express";
import { connectDB } from "./config/db.js";
import users from "./routes/user.route.js";
import books from "./routes/book.route.js";
import { port } from "./config/envconfig.js";

const app = express();

app.use(express.json());

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
