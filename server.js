import "./config.js";
import express from "express";
import connectDB from "./db.js";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
const app = express();

const dbURI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.DB_URL;
connectDB(dbURI);

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("Server started at port 3000");
});

export { app, server };
