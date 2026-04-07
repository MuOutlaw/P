import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function CtaSection() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-primary-foreground mb-4 text-balance">
            ابدأ التداول اليوم
            <span className="block text-accent mt-1">بدون تعقيد</span>
          </h2>
          <p className="text-primary-foreground/75 text-lg mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف التجار الذين يبيعون ويشترون عبر الصفاة. التسجيل مجاني وفوري برقم جوالك.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-10"
            >
              سجّل الآن مجانًا
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10 font-semibold"
            >
              تصفح الإعلانات
            </Button>
          </div>
          <p className="text-primary-foreground/50 text-sm mt-6">
            لا حاجة لبطاقة ائتمانية · التسجيل مجاني تمامًا
          </p>
        </motion.div>
      </div>
    </section>
  );
}
