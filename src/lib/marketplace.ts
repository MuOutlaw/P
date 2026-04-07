// Shared constants for the Al-Safah marketplace

export const CATEGORIES = [
  { id: "all", label: "الكل", emoji: "🏪" },
  { id: "camels", label: "الإبل", emoji: "🐪" },
  { id: "sheep", label: "الأغنام", emoji: "🐑" },
  { id: "cattle", label: "الأبقار", emoji: "🐄" },
  { id: "goats", label: "الماعز", emoji: "🐐" },
  { id: "feed", label: "الأعلاف", emoji: "🌾" },
  { id: "farms", label: "المزارع", emoji: "🏡" },
  { id: "services", label: "الخدمات", emoji: "🛠️" },
  { id: "transport", label: "النقل", emoji: "🚛" },
] as const;

export const SAUDI_CITIES = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام",
  "الخبر", "تبوك", "بريدة", "أبها", "الطائف", "حائل", "نجران",
  "الجوف", "الباحة", "عرعر", "جازان", "ينبع", "خميس مشيط",
] as const;

export type CategoryId = typeof CATEGORIES[number]["id"];

export function getCategoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getCategoryEmoji(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.emoji ?? "🏪";
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ar-SA") + " ر.س";
}
