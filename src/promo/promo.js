export class PromoError extends Error {
  constructor(reason) {
    super(reason);
    this.reason = reason;
  }
}

const KINDS = {
  percent: (value) => (base) => Math.round(base * value) / 100,
  fixed: (value) => (base) => Math.min(value, base),
};

export function validate(promo, now = Date.now()) {
  if (!promo) throw new PromoError("unknown");
  if (!KINDS[promo.kind]) throw new PromoError("bad-kind");
  if (promo.kind === "percent" && (promo.value <= 0 || promo.value > 100)) throw new PromoError("bad-value");
  if (promo.kind === "fixed" && promo.value <= 0) throw new PromoError("bad-value");
  if (promo.expiresAt && promo.expiresAt < now) throw new PromoError("expired");
  if (promo.maxUses != null && promo.uses >= promo.maxUses) throw new PromoError("exhausted");
  return { code: promo.code, discountFor: KINDS[promo.kind](promo.value) };
}
