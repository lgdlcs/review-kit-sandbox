import { VAT_RATES } from "./gen/vat-rates.js";

export function lineTotal(item) {
  return item.price * item.qty;
}

export function subtotal(items) {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function vat(amount, country) {
  const rate = VAT_RATES[country] ?? 0;
  return Math.round(amount * rate) / 100;
}

export function total(items, { country, promo } = {}) {
  const base = subtotal(items);
  const discounted = promo ? base - promo.discountFor(base) : base;
  return discounted + (country ? vat(discounted, country) : 0);
}
