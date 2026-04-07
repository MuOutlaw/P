import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { BOOST_PACKAGES } from "@/lib/boostPackages.ts";
import { Zap, Star, TrendingUp, Rocket, Clock, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import { motion } from "motion/react";

const ICON_MAP: Record<string, React.ReactNode> = {
  "⭐": <Star className="w-6 h-6" />,
  "🔝": <TrendingUp className="w-6 h-6" />,
  "🚀": <Rocket className="w-6 h-6" />,
};

const HIGHLIGHT_BORDER: Record<string, string> = {
  amber: "border-amber-300 hover:border-amber-400",
  blue: "border-blue-300 hover:border-blue-400",
  primary: "border-primary/50 hover:border-primary",
};

const HIGHLIGHT_BG: Record<string, string> = {
  amber: "bg-amber-50",
  blue: "bg-blue-50",
  primary: "bg-primary/5",
};

const HIGHLIGHT_ICON: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  primary: "bg-primary/10 text-primary",
};

const BENEFITS = [
  "ظهور إعلانك للآلاف من المشترين المهتمين",
  "شارة مميّزة تجذب الانتباه فوراً",
  "أولوية في نتائج البحث والفئات",
  "إحصائيات مشاهدات محسّنة",
  "دعم فني متخصص على مدار الساعة",
];

function SelectListingStep({ onSelect }: { onSelect: (listingId: string, title: string) => void }) {
  const navigate = useNavigate();
  const listings = useQuery(api.listings.queries.getMyListings, {});

  if (listings === undefined) {
    return <div className="text-center py-10 text-muted-foreground">جارٍ التحميل...</div>;
  }

  const active = listings.filter((l) => l.status === "active");

  if (active.length === 0) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-muted-foreground">ليس لديك إعلانات نشطة يمكن تمييزها</p>
        <Button onClick={() => navigate("/create-listing")} className="font-semibold gap-2">
          <Zap className="w-4 h-4" />
          انشر إعلاناً الآن
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="font-semibold text-foreground mb-4">اختر الإعلان الذي تريد تمييزه:</p>
      {active.map((listing) => (
        <button
          key={listing._id}
          onClick={() => onSelect(listing._id, listing.title)}
          className="w-full flex items-center gap-3 bg-white border border-border rounded-xl p-4 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all text-right"
        >
          <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
            {listing.images[0] ? (
              <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🐪</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground truncate">{listing.title}</p>
            <p className="text-xs text-muted-foreground">{listing.city} · {listing.price.toLocaleString("ar-SA")} ريال</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      ))}
    </div>
  );
}

export default function BoostPricingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"pricing" | "select">("pricing");
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPkg(pkgId);
    setStep("select");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary pt-14 pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            إعلانات مميّزة
          </div>
          <h1 className="text-4xl font-black text-primary-foreground mb-4 leading-tight">
            ضاعف مشاهدات إعلانك
            <br />وبع أسرع
          </h1>
          <p className="text-primary-foreground/75 text-lg max-w-md mx-auto">
            تميّز بين آلاف الإعلانات واجذب المشترين الجادين بأسعار تنافسية
          </p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-8 pb-16">

        {step === "pricing" ? (
          <>
            {/* Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
              {BOOST_PACKAGES.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "relative bg-white rounded-2xl border-2 p-6 transition-all",
                    HIGHLIGHT_BORDER[pkg.highlight] ?? "border-border",
                    pkg.popular && "shadow-lg"
                  )}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 right-5">
                      <Badge className="bg-primary text-primary-foreground text-xs px-3 py-1">
                        الأكثر طلباً
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", HIGHLIGHT_ICON[pkg.highlight])}>
                      {ICON_MAP[pkg.badge]}
                    </div>
                    <div className="text-left">
                      <div className="text-3xl font-black text-primary">{pkg.priceSAR}</div>
                      <div className="text-sm text-muted-foreground">ريال</div>
                    </div>
                  </div>

                  <h3 className="font-black text-foreground text-lg mb-1">{pkg.nameAr}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{pkg.descriptionAr}</p>

                  <div className={cn("flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg w-fit mb-5", HIGHLIGHT_BG[pkg.highlight], HIGHLIGHT_ICON[pkg.highlight])}>
                    <Clock className="w-3.5 h-3.5" />
                    {pkg.durationDays} يوم
                  </div>

                  <Authenticated>
                    <Button
                      className="w-full font-bold gap-2"
                      onClick={() => handlePackageSelect(pkg.id)}
                    >
                      <Zap className="w-4 h-4" />
                      ابدأ التمييز
                    </Button>
                  </Authenticated>
                  <Unauthenticated>
                    <SignInButton>
                      <Button className="w-full font-bold gap-2">
                        <Zap className="w-4 h-4" />
                        سجّل الدخول للبدء
                      </Button>
                    </SignInButton>
                  </Unauthenticated>
                </motion.div>
              ))}
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-border p-6 mb-8">
              <h2 className="font-black text-xl text-foreground mb-5">لماذا تميّز إعلانك؟</h2>
              <div className="space-y-3">
                {BENEFITS.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-center">
              <strong>ملاحظة:</strong> بوابة الدفع قيد الإعداد. سيتم تفعيل التمييز مجاناً كتجربة في الوقت الحالي.
            </div>
          </>
        ) : (
          /* Step 2: select listing */
          <div className="bg-white rounded-2xl border border-border p-6 mt-4">
            <button
              onClick={() => setStep("pricing")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 cursor-pointer transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للباقات
            </button>
            <h2 className="font-black text-xl text-foreground mb-5">اختر إعلانك</h2>
            <Authenticated>
              <SelectListingStep
                onSelect={(listingId, title) => {
                  navigate(`/my-listings`, { state: { boostListingId: listingId, boostPackageId: selectedPkg } });
                }}
              />
            </Authenticated>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
