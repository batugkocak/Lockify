import express, { Request, Response } from "express";
import { ServerConfig, connectDB } from "./configs";
import packageJson from "../package.json";
import auth from "./routes/auth";

const app = express();

// MIDDLEWARES
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

// ROUTES
app.use("/api/v1/auth", auth);

async function initializeServer(): Promise<void> {
  console.clear();
  console.info("\x1b[32m%s\x1b[0m", "----------------INFO----------------");
  console.info(`ℹ️ NODE_ENV:`, "\x1b[33m", `            ${ServerConfig.env}`);
  console.info(
    `ℹ️ URL:`,
    "\x1b[33m",
    `                 ${ServerConfig.host_url}`
  );
  console.info(`ℹ️ Port:`, "\x1b[33m", `                ${ServerConfig.port}`);
  console.info(`ℹ️ Database:`, "\x1b[33m", `            MongoDB`);

  console.info("\x1b[32m%s\x1b[0m", "---------------AUTHOR---------------");
  console.info(`ℹ️ Project Author:`, "\x1b[35m", `      ${packageJson.author}`);
  console.info(
    `ℹ️ Project Version:`,
    "\x1b[35m",
    `     ${packageJson.version}`
  );

  console.info("\x1b[32m%s\x1b[0m", "------------------------------------");
  console.log();

  await connectDB();

  await app.listen(ServerConfig.port, () => {
    console.log(`Server listening on port ${ServerConfig.port}`);
  });
}

initializeServer().catch((error) => {
  console.error("Failed to initialize the server:", error);
});
