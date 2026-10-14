import { migrate } from "./schema.js";

export function createStore(seed = {}) {
  const db = migrate(structuredClone({ orders: [], ...seed }));
  return {
    findPromo: (code) => db.promoCodes.find((p) => p.code === code.toUpperCase()),
    savePromo: (promo) => { db.promoCodes.push({ uses: 0, ...promo, code: promo.code.toUpperCase() }); },
    redeem: (code, orderId, now) => {
      const promo = db.promoCodes.find((p) => p.code === code);
      promo.uses += 1;
      db.promoRedemptions.push({ code, orderId, redeemedAt: now });
    },
    saveOrder: (order) => { db.orders.push(order); return order; },
    dump: () => structuredClone(db),
  };
}
