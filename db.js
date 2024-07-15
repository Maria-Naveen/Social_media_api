import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
  }
};

export default connectDB;
