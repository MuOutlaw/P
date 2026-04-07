import { motion } from "motion/react";

const CAMEL_IMG = "https://hercules-cdn.com/file_lSGcOeN9es8T5vhDdniYAGjR";
const SHEEP_IMG = "https://hercules-cdn.com/file_OfivSDFY68Ev0nnq1xL4eeSb";

const categories = [
  {
    id: "camels",
    name: "الإبل",
    nameEn: "Camels",
    count: "١٢٠٠+",
    image: CAMEL_IMG,
    color: "from-amber-900/80 to-amber-700/60",
  },
  {
    id: "sheep",
    name: "الأغنام",
    nameEn: "Sheep",
    count: "٢٤٠٠+",
    image: SHEEP_IMG,
    color: "from-emerald-900/80 to-emerald-700/60",
  },
  {
    id: "cattle",
    name: "الأبقار",
    nameEn: "Cattle",
    count: "٨٠٠+",
    image: null,
    color: "from-stone-800/90 to-stone-600/70",
    emoji: "🐄",
  },
  {
    id: "goats",
    name: "الماعز",
    nameEn: "Goats",
    count: "٦٠٠+",
    image: null,
    color: "from-brown-800/90 to-amber-800/70",
    emoji: "🐐",
  },
  {
    id: "feed",
    name: "الأعلاف",
    nameEn: "Feed & Grain",
    count: "٣٠٠+",
    image: null,
    color: "from-yellow-800/90 to-yellow-600/70",
    emoji: "🌾",
  },
  {
    id: "farms",
    name: "المزارع والعقارات",
    nameEn: "Farms & Land",
    count: "١٥٠+",
    image: null,
    color: "from-green-900/90 to-green-700/70",
    emoji: "🏡",
  },
  {
    id: "services",
    name: "الخدمات",
    nameEn: "Services",
    count: "٢٠٠+",
    image: null,
    color: "from-teal-800/90 to-teal-600/70",
    emoji: "🛠️",
  },
  {
    id: "transport",
    name: "النقل والشحن",
    nameEn: "Transport",
    count: "١٢٠+",
    image: null,
    color: "from-slate-700/90 to-slate-500/70",
    emoji: "🚛",
  },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            تصفح حسب الفئة
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            كل ما تحتاجه في مكان واحد
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            من المواشي والأعلاف إلى المزارع والخدمات الزراعية
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-[4/3]"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-primary/80" />
              )}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color}`} />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                {!cat.image && cat.emoji && (
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                )}
                <div className="text-white font-bold text-base leading-tight">{cat.name}</div>
                <div className="text-white/70 text-xs mt-0.5">{cat.count} إعلان</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
