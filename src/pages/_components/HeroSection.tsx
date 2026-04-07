import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Search, ArrowLeft, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "motion/react";

const HERO_IMG = "https://hercules-cdn.com/file_L1nseEw5DrGV1EyaT0k4CYxq";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="سوق المواشي"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl mr-0 ml-auto md:mr-auto md:ml-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-white text-sm font-medium">المنصة الأولى لتداول المواشي في المملكة</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6 text-balance">
              سوق المواشي
              <span className="block text-accent mt-1">الرقمي الموثوق</span>
            </h1>

            <p className="text-lg text-white/85 mb-8 leading-relaxed max-w-xl">
              منصة <strong className="text-accent">الصفاة</strong> تجمع بائعي ومشتري المواشي والأعلاف والخدمات الزراعية في مكان واحد آمن وسريع وموثوق
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl p-2 flex gap-2 shadow-2xl mb-6 max-w-lg">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن إبل، غنم، أبقار..."
                  className="pr-9 border-0 bg-transparent focus-visible:ring-0 text-foreground"
                />
              </div>
              <div className="flex items-center gap-1 px-3 border-r border-border text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                <MapPin className="w-4 h-4" />
                <span className="text-sm hidden sm:block">المنطقة</span>
              </div>
              <Button className="font-semibold px-5">
                بحث
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {["إبل", "أغنام", "أبقار", "أعلاف", "مزارع"].map((tag) => (
                <button
                  key={tag}
                  className="bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm px-4 py-1.5 rounded-full hover:bg-white/25 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-8"
              >
                ابدأ البيع الآن
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white border border-white/30 hover:bg-white/10 font-semibold"
              >
                تصفح الإعلانات
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="absolute bottom-8 left-4 right-4 md:left-auto md:right-8 flex gap-3 justify-center md:justify-end"
        >
          {[
            { value: "+٥٠٠٠", label: "إعلان نشط" },
            { value: "+١٢٠٠٠", label: "مستخدم موثوق" },
            { value: "٢٤/٧", label: "دعم متواصل" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center"
            >
              <div className="text-xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/70 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
