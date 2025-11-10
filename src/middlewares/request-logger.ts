import { logger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";
export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  logger.info({ method: req.method, url: req.url }, "Incoming request");
  next();
}
