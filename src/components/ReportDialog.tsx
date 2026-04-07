import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useAuth } from "@/hooks/use-auth.ts";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Label } from "@/components/ui/label.tsx";
import { toast } from "sonner";
import { Flag, CheckCircle2 } from "lucide-react";
import { ConvexError } from "convex/values";
import { cn } from "@/lib/utils.ts";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

type Reason = "spam" | "fraud" | "inappropriate" | "wrong_category" | "fake_price" | "other";

const REASONS: { value: Reason; label: string; desc: string }[] = [
  { value: "fraud",         label: "احتيال أو نصب",       desc: "يبدو أن الإعلان أو البائع غير موثوق" },
  { value: "spam",          label: "إعلان مكرر / سبام",   desc: "نفس الإعلان منشور أكثر من مرة" },
  { value: "inappropriate", label: "محتوى غير لائق",       desc: "صور أو كلام غير مناسب" },
  { value: "fake_price",    label: "سعر وهمي أو مضلل",    desc: "السعر لا يعكس الواقع" },
  { value: "wrong_category",label: "تصنيف خاطئ",          desc: "الإعلان في فئة غير صحيحة" },
  { value: "other",         label: "سبب آخر",              desc: "سبب مختلف، يرجى التوضيح أدناه" },
];

type Props =
  | { type: "listing"; targetId: Id<"listings">; targetTitle: string; open: boolean; onClose: () => void }
  | { type: "user";    targetId: Id<"users">;    targetTitle: string; open: boolean; onClose: () => void };

export default function ReportDialog(props: Props) {
  const { type, targetId, targetTitle, open, onClose } = props;
  const { user } = useAuth();
  const [reason, setReason] = useState<Reason | null>(null);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const reportListing = useMutation(api.reports.mutations.reportListing);
  const reportUser    = useMutation(api.reports.mutations.reportUser);

  const alreadyReportedListing = useQuery(
    api.reports.queries.hasReportedListing,
    type === "listing" && user ? { listingId: targetId as Id<"listings"> } : "skip"
  );
  const alreadyReportedUser = useQuery(
    api.reports.queries.hasReportedUser,
    type === "user" && user ? { userId: targetId as Id<"users"> } : "skip"
  );

  const alreadyReported = type === "listing" ? alreadyReportedListing : alreadyReportedUser;

  const handleClose = () => {
    setReason(null);
    setDetails("");
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason) { toast.error("يرجى اختيار سبب الإبلاغ"); return; }
    setLoading(true);
    try {
      if (type === "listing") {
        await reportListing({ listingId: targetId as Id<"listings">, reason, details: details || undefined });
      } else {
        await reportUser({ userId: targetId as Id<"users">, reason, details: details || undefined });
      }
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ConvexError) {
        const data = err.data as { message?: string };
        toast.error(data.message ?? "حدث خطأ");
      } else {
        toast.error("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-destructive" />
            {type === "listing" ? "الإبلاغ عن إعلان" : "الإبلاغ عن مستخدم"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground truncate">
            {targetTitle}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <p className="font-bold text-lg">شكراً على إبلاغك</p>
            <p className="text-sm text-muted-foreground">
              سيتم مراجعة البلاغ من قِبل فريق الإشراف قريباً
            </p>
            <Button className="mt-2" onClick={handleClose}>إغلاق</Button>
          </div>
        ) : alreadyReported ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <p className="font-bold">لقد أبلغت عن هذا {type === "listing" ? "الإعلان" : "المستخدم"} مسبقاً</p>
            <p className="text-sm text-muted-foreground">فريقنا يراجع البلاغات بعناية. شكراً لمساعدتك</p>
            <Button onClick={handleClose}>إغلاق</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reason selection */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">سبب الإبلاغ</Label>
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setReason(r.value)}
                    className={cn(
                      "w-full text-right p-3 rounded-xl border-2 transition-all cursor-pointer",
                      reason === r.value
                        ? "border-destructive bg-destructive/5"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <p className="text-sm font-semibold text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <Label htmlFor="details" className="text-sm font-semibold mb-2 block">
                تفاصيل إضافية (اختياري)
              </Label>
              <Textarea
                id="details"
                placeholder="اكتب أي تفاصيل تساعدنا في المراجعة..."
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1 text-left">{details.length}/500</p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="ghost" className="flex-1" onClick={handleClose}>إلغاء</Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                disabled={!reason || loading}
                onClick={handleSubmit}
              >
                <Flag className="w-4 h-4" />
                {loading ? "جارٍ الإرسال..." : "إرسال البلاغ"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
