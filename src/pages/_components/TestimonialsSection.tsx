import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "أبو فهد الشمري",
    role: "تاجر إبل - حائل",
    rating: 5,
    text: "الصفاة غيّرت طريقة تداولي كليًا. بعت قطيع إبل بالكامل في أسبوع واحد. الموقع موثوق والمشترين جادين.",
    avatar: "ف",
  },
  {
    name: "محمد العتيبي",
    role: "مزارع - الرياض",
    rating: 5,
    text: "أفضل منصة للبيع والشراء. نظام التقييمات يساعدك تعرف البائع الصادق. جربت منصات ثانية بس الصفاة الأحسن.",
    avatar: "م",
  },
  {
    name: "سعود القحطاني",
    role: "مربي أغنام - الطائف",
    rating: 5,
    text: "سهولة النشر والتواصل المباشر مع المشترين جعل التجربة ممتازة. نظام الاتفاقية حمى حقوقي في صفقة كانت صعبة.",
    avatar: "س",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            آراء المستخدمين
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            يثقون في الصفاة
          </h2>
          <p className="text-muted-foreground text-lg">
            آلاف التجار يستخدمون المنصة يوميًا
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-5">{`"${t.text}"`}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
