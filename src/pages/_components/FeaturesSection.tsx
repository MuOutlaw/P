import { motion } from "motion/react";
import { ShieldCheck, Star, MessageCircle, MapPin, Bell, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "نظام التوثيق والموثوقية",
    desc: "كل مستخدم يمر بعملية توثيق حقيقية. الشارة الخضراء تعني تاجرًا موثوقًا.",
    color: "bg-green-50 text-green-700",
  },
  {
    icon: BadgeCheck,
    title: "اتفاقية الالتزام",
    desc: "قبل أي صفقة، يوقع الطرفان على اتفاقية ضمان مبدأية تحمي حقوق الجميع.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Star,
    title: "نظام التقييم والمراجعات",
    desc: "شفافية كاملة من خلال تقييمات المشترين والبائعين بعد كل صفقة.",
    color: "bg-yellow-50 text-yellow-700",
  },
  {
    icon: MessageCircle,
    title: "الدردشة المباشرة",
    desc: "تواصل فوري وآمن بين البائع والمشتري داخل التطبيق دون الحاجة لمشاركة أرقامك.",
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: MapPin,
    title: "البحث بالموقع الجغرافي",
    desc: "فلترة الإعلانات حسب المدينة والمنطقة لتجد ما تحتاجه قريبًا منك.",
    color: "bg-orange-50 text-orange-700",
  },
  {
    icon: Bell,
    title: "إشعارات فورية",
    desc: "لا تفوت أي فرصة. احصل على إشعار فوري عند وجود رد على إعلانك أو رسالة جديدة.",
    color: "bg-red-50 text-red-700",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            لماذا الصفاة؟
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            منصة بُنيت على الثقة والأمان
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            كل ميزة في الصفاة صممت لتحميك وتسهل تجربة البيع والشراء
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-foreground font-bold text-lg mb-2">{feat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
