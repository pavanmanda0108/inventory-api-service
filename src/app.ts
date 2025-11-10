import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config";
import { requestLogger } from "./middlewares/request-logger";
import { errorHandler } from "./middlewares/error-handler";
import productRoutes from "./modules/products/product.routes";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: env.rateLimit.windowMs, max: env.rateLimit.max }));
app.use(requestLogger);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/products", productRoutes);

app.use(errorHandler);
export default app;
