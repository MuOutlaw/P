import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { MessageCircle } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  sellerId: Id<"users">;
  sellerName: string;
  listingId: Id<"listings">;
  listingTitle: string;
};

export default function ContactSellerDialog({
  open,
  onClose,
  sellerId,
  sellerName,
  listingId,
  listingTitle,
}: Props) {
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    `السلام عليكم، رأيت إعلانك عن "${listingTitle}" وأود الاستفسار.`
  );
  const [sending, setSending] = useState(false);
  const startConversation = useMutation(api.messages.mutations.startConversation);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const conversationId = await startConversation({
        otherUserId: sellerId,
        listingId,
        initialMessage: message.trim(),
      });
      toast.success("تم إرسال رسالتك بنجاح");
      onClose();
      navigate(`/messages/${conversationId}`);
    } catch (err) {
      if (err instanceof ConvexError) {
        const d = err.data as { message: string };
        toast.error(d.message);
      } else {
        toast.error("فشل إرسال الرسالة، حاول مجددًا");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            مراسلة {sellerName}
          </DialogTitle>
          <DialogDescription>
            سيصل رسالتك لـ {sellerName} مباشرةً عبر الصفاة
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="اكتب رسالتك للبائع..."
            className="resize-none"
          />

          <div className="flex gap-2">
            <Button onClick={handleSend} disabled={sending || !message.trim()} className="flex-1 font-semibold">
              {sending ? "جارٍ الإرسال..." : "إرسال الرسالة"}
            </Button>
            <Button variant="secondary" onClick={onClose} disabled={sending}>إلغاء</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
