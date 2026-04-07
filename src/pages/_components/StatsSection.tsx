import { motion } from "motion/react";

const stats = [
  { value: "٥,٢٠٠+", label: "إعلان نشط", desc: "إعلان متاح للتصفح الآن" },
  { value: "١٢,٨٠٠+", label: "مستخدم مسجل", desc: "بائع ومشترٍ موثوق" },
  { value: "٩٨٪", label: "رضا العملاء", desc: "تقييم إيجابي من المستخدمين" },
  { value: "٢٣", label: "منطقة مغطاة", desc: "في جميع أنحاء المملكة" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl font-black mb-1">{stat.value}</div>
              <div className="text-lg font-bold mb-1">{stat.label}</div>
              <div className="text-sm opacity-75">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
