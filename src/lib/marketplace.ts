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
];

export type CategoryId = typeof CATEGORIES[number]["id"];

export function getCategoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getCategoryEmoji(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.emoji ?? "🏪";
}

export function formatPrice(price: number, priceType: string): string {
  if (priceType === "negotiable") return `${price.toLocaleString("ar-SA")} ريال (قابل للتفاوض)`;
  return `${price.toLocaleString("ar-SA")} ريال`;
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 7) return `منذ ${days} يوم`;
  return new Date(dateStr).toLocaleDateString("ar-SA");
}
