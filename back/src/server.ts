import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/indexRoute";

const server = express();
server.use(morgan("dev"));
server.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
server.use(express.json());

server.use(router);

export default server;
