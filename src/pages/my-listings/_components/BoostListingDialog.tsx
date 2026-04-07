import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { Zap, Check, Clock, Star, TrendingUp, Rocket } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { BOOST_PACKAGES } from "@/lib/boostPackages.ts";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

const BADGE_ICONS: Record<string, React.ReactNode> = {
  "⭐": <Star className="w-4 h-4" />,
  "🔝": <TrendingUp className="w-4 h-4" />,
  "🚀": <Rocket className="w-4 h-4" />,
};

const HIGHLIGHT_CLASSES: Record<string, string> = {
  amber: "border-amber-300 bg-amber-50",
  blue: "border-blue-300 bg-blue-50",
  primary: "border-primary/40 bg-primary/5",
};

const HIGHLIGHT_BADGE: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-800",
  primary: "bg-primary/10 text-primary",
};

type Props = {
  open: boolean;
  onClose: () => void;
  listingId: Id<"listings">;
  listingTitle: string;
};

export default function BoostListingDialog({ open, onClose, listingId, listingTitle }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const activateBoost = useMutation(api.boosts.mutations.activateBoost);
  const existingBoosts = useQuery(api.boosts.queries.getForListing, { listingId });

  const activePackageIds = new Set(existingBoosts?.map((b) => b.packageId) ?? []);

  const handleBoost = async () => {
    if (!selected) { toast.error("اختر باقة أولاً"); return; }
    setLoading(true);
    try {
      // TODO: When Hercules Commerce is connected, replace this with a checkout flow.
      // For now, we activate directly as a free boost for demonstration.
      await activateBoost({
        listingId,
        packageId: selected,
        paymentStatus: "free",
      });
      toast.success("تم تفعيل الإعلان المميّز بنجاح!");
      onClose();
    } catch (err) {
      if (err instanceof ConvexError) {
        const d = err.data as { message: string };
        toast.error(d.message);
      } else {
        toast.error("حدث خطأ، حاول مجددًا");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            تمييز الإعلان
          </DialogTitle>
          <DialogDescription className="text-right">
            اختر باقة لتعزيز ظهور إعلانك:{" "}
            <span className="font-semibold text-foreground">{listingTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {BOOST_PACKAGES.map((pkg) => {
            const isActive = activePackageIds.has(pkg.id);
            const isSelected = selected === pkg.id;

            return (
              <button
                key={pkg.id}
                disabled={isActive}
                onClick={() => setSelected(isActive ? selected : pkg.id)}
                className={cn(
                  "w-full text-right rounded-xl border-2 p-4 transition-all cursor-pointer",
                  isActive
                    ? "opacity-60 cursor-not-allowed bg-muted border-border"
                    : isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : HIGHLIGHT_CLASSES[pkg.highlight] ?? "border-border bg-white hover:border-primary/40"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-foreground text-sm">{pkg.nameAr}</span>
                      {pkg.popular && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">
                          الأكثر طلباً
                        </Badge>
                      )}
                      {isActive && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-800">
                          نشط
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{pkg.descriptionAr}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1", HIGHLIGHT_BADGE[pkg.highlight])}>
                        {BADGE_ICONS[pkg.badge]} {pkg.badge}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {pkg.durationDays} يوم
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-left">
                    <div className="text-xl font-black text-primary">{pkg.priceSAR}</div>
                    <div className="text-xs text-muted-foreground">ريال</div>
                  </div>
                </div>

                {isSelected && !isActive && (
                  <div className="mt-2 pt-2 border-t border-primary/20 flex items-center gap-1.5 text-xs text-primary font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    الباقة المختارة
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Payment notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
          <strong>ملاحظة:</strong> خاصية الدفع قيد الإعداد. سيتم تفعيل الباقة الآن مجاناً كتجربة.
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={handleBoost}
            disabled={!selected || loading}
            className="flex-1 font-bold gap-2"
          >
            <Zap className="w-4 h-4" />
            {loading ? "جارٍ التفعيل..." : "فعّل التمييز"}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            إلغاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
