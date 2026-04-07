import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { MessageSquare, Tag } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";
import { cn } from "@/lib/utils.ts";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import Navbar from "../_components/Navbar.tsx";

function InboxInner() {
  const navigate = useNavigate();
  const conversations = useQuery(api.messages.queries.listConversations, {});

  if (conversations === undefined) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="py-20">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><MessageSquare /></EmptyMedia>
            <EmptyTitle>لا توجد رسائل</EmptyTitle>
            <EmptyDescription>تواصل مع البائعين من صفحة أي إعلان</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((conv) => {
        const hasUnread = conv.unreadCount > 0;
        return (
          <button
            key={conv._id}
            onClick={() => navigate(`/messages/${conv._id}`)}
            className="w-full flex items-start gap-3 px-4 py-4 hover:bg-muted/40 transition-colors cursor-pointer text-right"
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base shrink-0 mt-0.5">
              {conv.otherUser?.name?.charAt(0) ?? "م"}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={cn("text-sm truncate", hasUnread ? "font-bold text-foreground" : "font-medium text-foreground/80")}>
                  {conv.otherUser?.name ?? "مستخدم"}
                </span>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true, locale: ar })}
                </span>
              </div>

              {conv.listing && (
                <div className="flex items-center gap-1 text-xs text-primary mb-0.5">
                  <Tag className="w-3 h-3" />
                  <span className="truncate">{conv.listing.title}</span>
                </div>
              )}

              <p className={cn("text-xs truncate", hasUnread ? "text-foreground font-medium" : "text-muted-foreground")}>
                {conv.lastMessageText ?? ""}
              </p>
            </div>

            {/* Unread badge */}
            {hasUnread && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shrink-0 mt-1">
                {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto border-x border-border min-h-[calc(100vh-64px)]">
        <div className="px-4 py-5 border-b border-border bg-white">
          <h1 className="text-xl font-black text-foreground">الرسائل</h1>
          <p className="text-sm text-muted-foreground">محادثاتك مع البائعين والمشترين</p>
        </div>
        <AuthLoading>
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </AuthLoading>
        <Unauthenticated>
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-muted-foreground">يجب تسجيل الدخول لعرض الرسائل</p>
            <SignInButton><Button className="font-bold">تسجيل الدخول</Button></SignInButton>
          </div>
        </Unauthenticated>
        <Authenticated>
          <InboxInner />
        </Authenticated>
      </div>
    </div>
  );
}
