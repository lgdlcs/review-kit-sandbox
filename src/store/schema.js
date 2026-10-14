export const SCHEMA_VERSION = 2;

export const tables = {
  orders: ["id", "items", "country", "total", "createdAt"],
  promoCodes: ["code", "kind", "value", "expiresAt", "maxUses", "uses"],
  promoRedemptions: ["code", "orderId", "redeemedAt"],
};

export function migrate(db) {
  if ((db.version ?? 1) < 2) {
    db.promoCodes ??= [];
    db.promoRedemptions ??= [];
    db.version = 2;
  }
  return db;
}
