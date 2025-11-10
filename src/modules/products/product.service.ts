import { ProductRepo } from "./product.repo";
import type { ProductCreateInput } from "./product.model";

function mapSqliteConstraint(e: any) {
  // SQLite constraint code is 'SQLITE_CONSTRAINT' (errno 19)
  const msg = (e && e.message) || "";
  if (msg.includes("UNIQUE constraint failed: products.item_cd")) {
    const err: any = new Error("A product with this item_cd already exists");
    err.status = 409; return err;
  }
  if (msg.includes("UNIQUE constraint failed: products.barcode")) {
    const err: any = new Error("A product with this barcode already exists");
    err.status = 409; return err;
  }
  if (msg.includes("UNIQUE constraint failed: products.qr_code")) {
    const err: any = new Error("A product with this qr_code already exists");
    err.status = 409; return err;
  }
  return e;
}

export const ProductService = {
  async lookup(payload: { item_cd?: string; bar_code?: string; qr_code?: string; }) {
    if (!payload.item_cd && !payload.bar_code && !payload.qr_code) {
      const err: any = new Error("Provide at least one of: item_cd, bar_code, qr_code");
      err.status = 400;
      throw err;
    }
    return ProductRepo.findOneByAny(payload);
  },
  async createOne(payload: ProductCreateInput) {
    // minimal required fields check
    if (!payload.item_cd || !payload.item_name || payload.mrp === undefined || payload.mrp === null) {
      const err: any = new Error("item_cd, item_name, mrp are required");
      err.status = 400;
      throw err;
    }
    try {
      return await ProductRepo.createOne(payload);
    } catch (e: any) {
      throw mapSqliteConstraint(e);
    }
  },

  async createMany(items: ProductCreateInput[]) {
    if (!Array.isArray(items) || !items.length) {
      const err: any = new Error("Provide a non-empty array of products");
      err.status = 400; throw err;
    }
    // basic validate each
    for (const p of items) {
      if (!p.item_cd || !p.item_name || p.mrp === undefined || p.mrp === null) {
        const err: any = new Error("Each product must have item_cd, item_name, mrp");
        err.status = 400; throw err;
      }
    }
    try {
      return await ProductRepo.createMany(items);
    } catch (e: any) {
      throw mapSqliteConstraint(e);
    }
  }
};
