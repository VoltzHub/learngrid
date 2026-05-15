// The Naira glyph (₦) has two horizontal strokes that visually merge with
// numerals when they sit immediately adjacent — looks like the price is
// struck through. A thin non-breaking space (U+202F) keeps the glyph clear
// without adding too much visible gap.
const THIN_NBSP = " ";

export function ngn(amount: number): string {
  return `₦${THIN_NBSP}${amount.toLocaleString("en-NG")}`;
}
