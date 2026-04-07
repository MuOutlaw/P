// Boost package definitions shared across the frontend
export type BoostPackage = {
  id: string;
  nameAr: string;
  descriptionAr: string;
  durationDays: number;
  priceSAR: number;
  badge: string;
  highlight: string;
  popular?: boolean;
};

export const BOOST_PACKAGES: BoostPackage[] = [
  {
    id: "featured_7d",
    nameAr: "إعلان مميّز — ٧ أيام",
    descriptionAr: "يظهر إعلانك في قسم الإعلانات المميّزة على الصفحة الرئيسية والسوق لمدة ٧ أيام",
    durationDays: 7,
    priceSAR: 49,
    badge: "⭐",
    highlight: "amber",
  },
  {
    id: "featured_14d",
    nameAr: "إعلان مميّز — ١٤ يوماً",
    descriptionAr: "يظهر إعلانك في قسم الإعلانات المميّزة على الصفحة الرئيسية والسوق لمدة ١٤ يوماً",
    durationDays: 14,
    priceSAR: 89,
    badge: "⭐",
    highlight: "amber",
    popular: true,
  },
  {
    id: "top_3d",
    nameAr: "أعلى نتائج البحث — ٣ أيام",
    descriptionAr: "يظهر إعلانك في أعلى قائمة نتائج البحث والفئة لمدة ٣ أيام",
    durationDays: 3,
    priceSAR: 29,
    badge: "🔝",
    highlight: "blue",
  },
  {
    id: "bundle_30d",
    nameAr: "حزمة القوة — ٣٠ يوماً",
    descriptionAr: "تميّز + أعلى النتائج + شارة مميّزة لمدة ٣٠ يوماً كاملة — أفضل قيمة",
    durationDays: 30,
    priceSAR: 199,
    badge: "🚀",
    highlight: "primary",
  },
];

export function getPackageById(id: string): BoostPackage | undefined {
  return BOOST_PACKAGES.find((p) => p.id === id);
}
