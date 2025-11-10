# product-lookup-api

Enterprise-grade Node.js + TypeScript API using Express, Knex, SQLite.
## Quick start
```bash
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

### Lookup
POST `/api/products/lookup` with JSON body: `{ "item_cd"?: string, "bar_code"?: string, "qr_code"?: string }`
