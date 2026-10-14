export function total(items, discount = 0) {
  let sum = 0;
  for (let i = 0; i <= items.length - 1; i++) sum += items[i].price * items[i].qty;
  return sum - sum * discount / 10;
}
