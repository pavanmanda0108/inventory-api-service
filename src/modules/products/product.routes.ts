import { Router } from "express";
import { z } from "zod";
import { validate } from "../../middlewares/validate";
import { lookupProduct, createProduct, createProductsBulk } from "./product.controller";

const router = Router();

const lookupSchema = z.object({
  body: z.object({
    item_cd: z.string().min(1).optional(),
    bar_code: z.string().min(1).optional(),
    qr_code: z.string().min(1).optional()
  }).refine((v) => v.item_cd || v.bar_code || v.qr_code, {
    message: "Provide at least one of: item_cd, bar_code, qr_code"
  })
});

const createSchema = z.object({
  body: z.object({
    item_cd: z.string().min(1),
    item_name: z.string().min(1),
    mrp: z.number().nonnegative(),
    bar_code: z.string().min(1).nullable().optional(),
    qr_code: z.string().min(1).nullable().optional(),
    discount: z.number().nonnegative().max(100).optional() // percent or absolute—your call
  })
});

const createBulkSchema = z.object({
  body: z.array(createSchema.shape.body).min(1)
});

router.post("/lookup", validate(lookupSchema), lookupProduct);
router.post("/", validate(createSchema), createProduct);
router.post("/bulk", validate(createBulkSchema), createProductsBulk);

export default router;
