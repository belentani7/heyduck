import express from "express";
import { createDuckRouter } from "./api";

const app = express();
const port = Number(process.env.DUCK_PORT ?? process.env.PORT ?? 4200);
app.use("/api/duck", createDuckRouter());

const server = app.listen(port, "0.0.0.0", () => {
  console.log(JSON.stringify({ event: "duck.api.start", service: "duck-music-producer", port, pid: process.pid, at: new Date().toISOString() }));
});

const shutdown = (signal: string) => {
  console.log(JSON.stringify({ event: "duck.api.stop", signal, at: new Date().toISOString() }));
  server.close(() => process.exit(0));
};
process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
