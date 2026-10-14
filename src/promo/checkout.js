import { total } from "../cart.js";
import { isOn } from "../flags.js";
import { validate } from "./promo.js";

export function checkout(store, { items, country, code }, { now = Date.now(), env = process.env, id = crypto.randomUUID() } = {}) {
  let promo;
  if (code && isOn("PROMO_CODES", env)) promo = validate(store.findPromo(code), now);
  const order = store.saveOrder({ id, items, country, total: total(items, { country, promo }), createdAt: now });
  if (promo) store.redeem(promo.code, order.id, now);
  return order;
}
