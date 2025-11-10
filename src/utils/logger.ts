import pino from "pino";
import { env } from "../config";
export const logger = pino({
  level: env.logLevel,
  transport: process.env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined
});
