import test from "node:test";
import assert from "node:assert/strict";
import { subtotal, total, vat } from "./cart.js";

test("total sums price * qty", () => {
  assert.equal(total([{ price: 2, qty: 3 }, { price: 1, qty: 1 }]), 7);
});

test("subtotal of empty cart is 0", () => {
  assert.equal(subtotal([]), 0);
});

test("unknown country has no vat", () => {
  assert.equal(vat(100, "ZZZ"), 0);
});
