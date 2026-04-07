import { motion } from "motion/react";

const steps = [
  {
    number: "١",
    title: "سجل حسابك",
    desc: "أنشئ حسابك برقم الجوال في دقيقة واحدة. بدون تعقيدات.",
  },
  {
    number: "٢",
    title: "انشر إعلانك",
    desc: "أضف صور واضحة، حدد السعر والموقع وانشر إعلانك مجانًا.",
  },
  {
    number: "٣",
    title: "تفاوض وتواصل",
    desc: "تلقَّ عروض المشترين وتواصل معهم مباشرة عبر الدردشة الآمنة.",
  },
  {
    number: "٤",
    title: "أتمم الصفقة بأمان",
    desc: "وقّع اتفاقية الالتزام وأتمم صفقتك بثقة تامة.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            كيف تعمل المنصة
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            أربع خطوات فقط
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            من التسجيل إلى إتمام الصفقة، كل شيء سهل وسريع
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 right-[12%] left-[12%] h-0.5 bg-border z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg mb-5 ring-4 ring-background">
                  <span className="text-primary-foreground font-black text-2xl">{step.number}</span>
                </div>
                <h3 className="text-foreground font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
