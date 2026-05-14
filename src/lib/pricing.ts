// LearnGrid sets the price tiers — like Udemy. Teachers pick a tier, not a free amount.
// This keeps the marketplace consistent for students and protects margins.

export type PriceTier = {
  id: string;
  priceNgn: number;
  label: string;
  description: string;
};

export const PRICE_TIERS: readonly PriceTier[] = [
  { id: "starter", priceNgn: 500, label: "Starter — ₦500", description: "Quick concept sessions, drills, Q&A." },
  { id: "standard", priceNgn: 1500, label: "Standard — ₦1,500", description: "Regular subject classes, single topic." },
  { id: "premium", priceNgn: 3000, label: "Premium — ₦3,000", description: "Deep-dive masterclasses, exam prep." },
  { id: "pro", priceNgn: 5000, label: "Pro — ₦5,000", description: "Specialised coaching, certification prep." },
];

export const ALLOWED_PRICES = PRICE_TIERS.map((t) => t.priceNgn);

export function isAllowedPrice(price: number): boolean {
  return ALLOWED_PRICES.includes(price);
}

export function findTier(price: number): PriceTier | undefined {
  return PRICE_TIERS.find((t) => t.priceNgn === price);
}
