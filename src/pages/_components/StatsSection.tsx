import { motion } from "motion/react";

const stats = [
  { value: "٥,٢٠٠+", label: "إعلان نشط", desc: "إعلان متاح للتصفح الآن" },
  { value: "١٢,٨٠٠+", label: "مستخدم مسجل", desc: "بائع ومشترٍ موثوق" },
  { value: "٩٨٪", label: "رضا العملاء", desc: "تقييم إيجابي من المستخدمين" },
  { value: "٢٣", label: "منطقة مغطاة", desc: "في جميع أنحاء المملكة" },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-black text-accent mb-1">{stat.value}</div>
              <div className="text-primary-foreground font-bold text-sm mb-0.5">{stat.label}</div>
              <div className="text-primary-foreground/60 text-xs hidden md:block">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
