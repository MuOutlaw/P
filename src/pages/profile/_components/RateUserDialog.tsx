import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { cn } from "@/lib/utils.ts";

type Props = {
  open: boolean;
  onClose: () => void;
  ratedUserId: Id<"users">;
  ratedUserName: string;
};

export default function RateUserDialog({ open, onClose, ratedUserId, ratedUserName }: Props) {
  const existing = useQuery(api.ratings.queries.getMyRatingForUser, { ratedUserId });
  const submitRating = useMutation(api.ratings.mutations.submitRating);
  const deleteRating = useMutation(api.ratings.mutations.deleteRating);

  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(existing?.score ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [saving, setSaving] = useState(false);

  // Sync with existing when loaded
  const displayScore = hovered || selected || existing?.score || 0;

  const handleSubmit = async () => {
    if (!selected) { toast.error("اختر عدد النجوم أولاً"); return; }
    setSaving(true);
    try {
      await submitRating({ ratedUserId, score: selected, comment: comment.trim() || undefined });
      toast.success(existing ? "تم تحديث تقييمك" : "شكرًا على تقييمك!");
      onClose();
    } catch (err) {
      if (err instanceof ConvexError) {
        const d = err.data as { message: string };
        toast.error(d.message);
      } else {
        toast.error("حدث خطأ، حاول مجددًا");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteRating({ ratedUserId });
      toast.success("تم حذف تقييمك");
      onClose();
    } catch {
      toast.error("فشل حذف التقييم");
    } finally {
      setSaving(false);
    }
  };

  const LABELS = ["", "سيء", "مقبول", "جيد", "جيد جداً", "ممتاز"];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            {existing ? "تعديل تقييمك" : `قيّم ${ratedUserName}`}
          </DialogTitle>
          <DialogDescription>
            تقييمك يساعد المجتمع على الثقة ببعض
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Stars */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHovered(n)}
                  onClick={() => setSelected(n)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-9 h-9 transition-colors",
                      n <= displayScore
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
            {displayScore > 0 && (
              <span className="text-sm font-semibold text-muted-foreground">
                {LABELS[displayScore]}
              </span>
            )}
          </div>

          {/* Comment */}
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="أضف تعليقًا (اختياري)..."
            rows={3}
            className="resize-none"
            maxLength={300}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={saving || !selected}
              className="flex-1 font-semibold"
            >
              {saving ? "جارٍ الحفظ..." : existing ? "تحديث التقييم" : "إرسال التقييم"}
            </Button>
            {existing && (
              <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                حذف
              </Button>
            )}
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
