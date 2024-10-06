import mongoose from "mongoose";

const MAX_RETRIES = 5;
let retries = 0;

const connectDB = async (): Promise<void> => {
  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI as string);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      break;
    } catch (err) {
      retries++;
      console.error(
        `Attempt ${retries} failed: ${err instanceof Error ? err.message : err}`
      );

      if (retries === MAX_RETRIES) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      } else {
        console.log(`Retrying to connect in 5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
};

export default connectDB;
