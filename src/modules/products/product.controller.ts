import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";

export async function lookupProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await ProductService.lookup(req.body);
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (e) { next(e); }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await ProductService.createOne(req.body);
    return res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function createProductsBulk(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await ProductService.createMany(req.body);
    return res.status(201).json({ count: created.length, items: created });
  } catch (e) { next(e); }
}
