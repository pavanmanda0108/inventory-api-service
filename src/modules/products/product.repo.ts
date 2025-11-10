// src/modules/products/product.repo.ts
import db from '../../db'; // shared Knex instance
import type { ProductCreateInput } from './product.model';

function toDbRow(p: ProductCreateInput) {
  return {
    item_cd: p.item_cd,
    item_name: p.item_name,
    mrp: p.mrp,
    barcode: p.bar_code ?? null, // map API -> DB
    qr_code: p.qr_code ?? null,
    discount: p.discount ?? 0,
  };
}

export const ProductRepo = {
  async findOneByAny({ item_cd, bar_code, qr_code }: { item_cd?: string; bar_code?: string; qr_code?: string; }) {
    let q = db('products').select('item_cd', 'item_name', 'mrp', 'barcode', 'qr_code', 'discount').limit(1);
    if (item_cd || bar_code || qr_code) {
      q = q.where((builder) => {
        if (item_cd) builder.orWhere('item_cd', item_cd);
        if (bar_code) builder.orWhere('barcode', bar_code);
        if (qr_code) builder.orWhere('qr_code', qr_code);
      });
    }
    return q.first();
  },

  async createOne(payload: ProductCreateInput) {
    const [row] = await db('products')
      .insert(toDbRow(payload))
      .returning(['item_cd', 'item_name', 'mrp', 'barcode', 'qr_code', 'discount'])
      .catch((e) => { throw e; });

    // SQLite before v3.35 doesn’t support RETURNING; fallback if needed
    if (!row) {
      return db('products')
        .where({ item_cd: payload.item_cd })
        .first('item_cd', 'item_name', 'mrp', 'barcode', 'qr_code', 'discount');
    }
    return row;
  },

  async createMany(items: ProductCreateInput[]) {
    if (!items.length) return [];
    const rows = items.map(toDbRow);
    await db.transaction(async (trx) => {
      await trx('products').insert(rows);
    });
    // fetch created (by item_cd list)
    const ids = items.map(i => i.item_cd);
    const created = await db('products')
      .whereIn('item_cd', ids)
      .select('item_cd', 'item_name', 'mrp', 'barcode', 'qr_code', 'discount');
    return created;
  }
};

