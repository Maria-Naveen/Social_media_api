import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
  }
};

export default connectDB;
