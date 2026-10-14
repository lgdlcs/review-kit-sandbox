const MESSAGES = {
  unknown: "Ce code n'existe pas.",
  expired: "Ce code a expiré.",
  exhausted: "Ce code a déjà été utilisé.",
  "bad-value": "Ce code est invalide.",
  "bad-kind": "Ce code est invalide.",
};

const form = document.querySelector("#promo");
const error = document.querySelector("#promo-error");
const totalEl = document.querySelector("#total");

const config = await fetch("/api/config").then((r) => r.json());
form.hidden = !config.flags.PROMO_CODES;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  error.textContent = "";
  const res = await fetch("/api/checkout/preview", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code: form.code.value }),
  });
  const body = await res.json();
  if (!res.ok) error.textContent = MESSAGES[body.reason] ?? "Erreur.";
  else totalEl.textContent = `${body.total.toFixed(2)} €`;
});
