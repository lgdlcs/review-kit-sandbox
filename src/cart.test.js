import test from "node:test";
import assert from "node:assert/strict";
import { total } from "./cart.js";

test("total sums price * qty", () => {
  assert.equal(total([{ price: 2, qty: 3 }, { price: 1, qty: 1 }]), 7);
});
