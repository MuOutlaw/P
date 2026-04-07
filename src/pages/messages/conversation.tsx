import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { ArrowRight, Send, Tag, MapPin } from "lucide-react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { cn } from "@/lib/utils.ts";
import Navbar from "../_components/Navbar.tsx";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

function ConversationViewInner({ conversationId }: { conversationId: Id<"conversations"> }) {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const result = useQuery(api.messages.queries.getMessages, { conversationId });
  const sendMessage = useMutation(api.messages.mutations.sendMessage);
  const markRead = useMutation(api.messages.mutations.markConversationRead);

  // Mark as read when conversation opens
  useEffect(() => {
    markRead({ conversationId }).catch(() => null);
  }, [conversationId, markRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result?.messages.length]);

  if (!result) {
    return (
      <div className="flex-1 flex flex-col gap-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className={cn("h-10 w-2/3 rounded-2xl", i % 2 === 0 ? "self-start" : "self-end")} />
        ))}
      </div>
    );
  }

  const { messages, currentUserId, conversation } = result;

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);
    try {
      await sendMessage({ conversationId, text: trimmed });
      setText("");
    } catch (err) {
      if (err instanceof ConvexError) {
        const d = err.data as { message: string };
        toast.error(d.message);
      } else {
        toast.error("فشل إرسال الرسالة");
      }
    } finally {
      setSending(false);
    }
  };

  const otherParticipantId = conversation.participantIds.find((id) => id !== currentUserId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-white shrink-0">
        <button
          onClick={() => navigate("/messages")}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <ConversationHeader conversationId={conversationId} currentUserId={currentUserId} otherParticipantId={otherParticipantId} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/20">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            لا توجد رسائل بعد. ابدأ المحادثة!
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div key={msg._id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  isMine
                    ? "bg-primary text-primary-foreground rounded-bl-sm"
                    : "bg-white text-foreground border border-border rounded-br-sm shadow-sm"
                )}
              >
                <p>{msg.text}</p>
                <p className={cn("text-[10px] mt-1 text-right", isMine ? "text-primary-foreground/60" : "text-muted-foreground")}>
                  {formatDistanceToNow(new Date(msg.sentAt), { addSuffix: true, locale: ar })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-white shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-1"
            disabled={sending}
          />
          <Button type="submit" size="icon" disabled={sending || !text.trim()} className="shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function ConversationHeader({
  conversationId,
  currentUserId,
  otherParticipantId,
}: {
  conversationId: Id<"conversations">;
  currentUserId: Id<"users">;
  otherParticipantId: Id<"users"> | undefined;
}) {
  const result = useQuery(api.messages.queries.getMessages, { conversationId });
  const conversation = result?.conversation;
  const navigate = useNavigate();

  // Always call hooks unconditionally — skip when no id
  const otherUser = useQuery(
    api.users.getUserById,
    otherParticipantId ? { userId: otherParticipantId } : "skip"
  );

  const listing = useQuery(
    api.listings.queries.getById,
    conversation?.listingId ? { id: conversation.listingId } : "skip"
  );

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
          {otherUser?.name?.charAt(0) ?? "م"}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{otherUser?.name ?? "..."}</p>
          {listing && (
            <button
              onClick={() => navigate(`/listings/${listing._id}`)}
              className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer truncate max-w-full"
            >
              <Tag className="w-3 h-3 shrink-0" />
              <span className="truncate">{listing.title}</span>
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{listing.city}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <AuthLoading>
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="w-full max-w-2xl h-[600px] rounded-2xl" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-muted-foreground">يجب تسجيل الدخول لعرض الرسائل</p>
          <SignInButton><Button className="font-bold">تسجيل الدخول</Button></SignInButton>
        </div>
      </Unauthenticated>
      <Authenticated>
        <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto border-x border-border" style={{ height: "calc(100vh - 64px)" }}>
          {id ? (
            <ConversationViewInner conversationId={id as Id<"conversations">} />
          ) : (
            <p className="text-center text-muted-foreground py-20">المحادثة غير موجودة</p>
          )}
        </div>
      </Authenticated>
    </div>
  );
}
