import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../store/memory.js";
import { checkout } from "./checkout.js";
import { validate, PromoError } from "./promo.js";

const items = [{ price: 50, qty: 2 }];
const on = { FLAG_PROMO_CODES: "1" };
const now = 1_000;
const store = () => {
  const s = createStore();
  s.savePromo({ code: "ten", kind: "percent", value: 10 });
  s.savePromo({ code: "five", kind: "fixed", value: 5, maxUses: 1 });
  s.savePromo({ code: "old", kind: "percent", value: 50, expiresAt: 10 });
  return s;
};

test("percent code takes 10% off", () => {
  assert.equal(checkout(store(), { items, code: 'TEN' }, { now, env: on }).total, 90);
});

test("fixed code takes 5 off", () => {
  assert.equal(checkout(store(), { items, code: 'five' }, { now, env: on }).total, 95);
});

test("flag off ignores the code", () => {
  assert.equal(checkout(store(), { items, code: 'TEN' }, { now, env: {} }).total, 100);
});

test("vat applies after discount", () => {
  assert.equal(checkout(store(), { items, code: 'TEN', country: 'AA' }, { now, env: on }).total > 90, true);
});

test("no code is plain total", () => {
  assert.equal(checkout(store(), { items }, { now, env: on }).total, 100);
});

test("rejects unknown", () => {
  assert.throws(() => validate(undefined, now), (e) => e instanceof PromoError && e.reason === "unknown");
});

test("rejects expired", () => {
  assert.throws(() => validate({ code: 'OLD', kind: 'percent', value: 50, expiresAt: 10 }, now), (e) => e instanceof PromoError && e.reason === "expired");
});

test("rejects exhausted", () => {
  assert.throws(() => validate({ code: 'X', kind: 'fixed', value: 5, maxUses: 1, uses: 1 }, now), (e) => e instanceof PromoError && e.reason === "exhausted");
});

test("rejects bad-value", () => {
  assert.throws(() => validate({ code: 'X', kind: 'percent', value: 150 }, now), (e) => e instanceof PromoError && e.reason === "bad-value");
});

test("rejects bad-kind", () => {
  assert.throws(() => validate({ code: 'X', kind: 'bogo', value: 1 }, now), (e) => e instanceof PromoError && e.reason === "bad-kind");
});

test("redemption is recorded once", () => {
  const s = store();
  checkout(s, { items, code: "five" }, { now, env: on, id: "o1" });
  assert.deepEqual(s.dump().promoRedemptions, [{ code: "FIVE", orderId: "o1", redeemedAt: now }]);
  assert.throws(() => checkout(s, { items, code: "five" }, { now, env: on }), (e) => e.reason === "exhausted");
});
