import express from "express";
import connectDB from "./db.js";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
const app = express();
connectDB();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
