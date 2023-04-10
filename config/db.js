import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MDB_URL);
    console.log(
      `Connected to MongoDatabase ${conn.connection.host}`.bgGreen.black
    );
  } catch (error) {
    console.log(`Error in MongoDB ${error}`);
  }
};

export default connectDB;
