export type Product = {
  item_cd: string;
  item_name: string;
  mrp: number;
  barcode: string | null;
  qr_code: string | null;
  discount: number;
};

export type ProductCreateInput = {
  item_cd: string;
  item_name: string;
  mrp: number;
  bar_code?: string | null; // API field
  qr_code?: string | null;
  discount?: number;
};
