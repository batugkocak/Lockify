import dotenv from "dotenv";
dotenv.config();

export * from "./auth";
export * from "./server";
export { default as connectDB } from "./database";
