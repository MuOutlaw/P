import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Bell, MessageCircle, Star, Heart, CheckCheck, Trash2, Zap, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils.ts";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

type NotificationType =
  | "new_message"
  | "new_rating"
  | "listing_saved"
  | "listing_sold"
  | "boost_expired"
  | "listing_inquiry";

type Notification = {
  _id: Id<"notifications">;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  listingId?: Id<"listings">;
  conversationId?: Id<"conversations">;
  actorId?: Id<"users">;
  actorName?: string | null;
  actorAvatar?: string | null;
  listingTitle?: string | null;
};

function notifIcon(type: NotificationType) {
  switch (type) {
    case "new_message": return <MessageCircle className="w-4 h-4" />;
    case "new_rating": return <Star className="w-4 h-4" />;
    case "listing_saved": return <Heart className="w-4 h-4" />;
    case "listing_sold": return <ShoppingBag className="w-4 h-4" />;
    case "boost_expired": return <Zap className="w-4 h-4" />;
    case "listing_inquiry": return <MessageCircle className="w-4 h-4" />;
  }
}

function notifColor(type: NotificationType) {
  switch (type) {
    case "new_message": return "bg-blue-100 text-blue-600";
    case "new_rating": return "bg-amber-100 text-amber-600";
    case "listing_saved": return "bg-red-100 text-red-500";
    case "listing_sold": return "bg-green-100 text-green-600";
    case "boost_expired": return "bg-purple-100 text-purple-600";
    case "listing_inquiry": return "bg-primary/10 text-primary";
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
}

function NotifItem({ notif }: { notif: Notification }) {
  const navigate = useNavigate();
  const markRead = useMutation(api.notifications.mutations.markRead);
  const deleteNotif = useMutation(api.notifications.mutations.deleteNotification);

  const handleClick = async () => {
    if (!notif.isRead) {
      await markRead({ notificationId: notif._id });
    }
    if (notif.conversationId) {
      navigate(`/messages/${notif.conversationId}`);
    } else if (notif.listingId) {
      navigate(`/listings/${notif.listingId}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotif({ notificationId: notif._id });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all group hover:shadow-sm",
        notif.isRead
          ? "bg-background border-border"
          : "bg-primary/5 border-primary/20"
      )}
    >
      {/* Icon */}
      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", notifColor(notif.type))}>
        {notifIcon(notif.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-semibold", !notif.isRead && "text-foreground")}>
            {notif.title}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            {!notif.isRead && (
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
            )}
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{notif.body}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo(notif.createdAt)}</p>
      </div>
    </motion.div>
  );
}

function NotificationsInner() {
  const notifications = useQuery(api.notifications.queries.getMyNotifications, {});
  const markAllRead = useMutation(api.notifications.mutations.markAllRead);
  const clearAll = useMutation(api.notifications.mutations.clearAll);

  if (notifications === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (notifications.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><Bell /></EmptyMedia>
          <EmptyTitle>لا توجد إشعارات</EmptyTitle>
          <EmptyDescription>ستظهر هنا إشعاراتك عند وصول رسائل أو تقييمات جديدة</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div>
      {/* Actions bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : "جميع الإشعارات مقروءة"}
        </p>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
              onClick={async () => {
                await markAllRead();
                toast.success("تم تحديد الكل كمقروء");
              }}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              تحديد الكل كمقروء
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-destructive hover:text-destructive"
            onClick={async () => {
              await clearAll();
              toast.success("تم حذف جميع الإشعارات");
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            حذف الكل
          </Button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {(notifications as Notification[]).map((n) => (
            <NotifItem key={n._id} notif={n} />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">الإشعارات</h1>
            <p className="text-sm text-muted-foreground">رسائلك وتنبيهاتك ومستجداتك</p>
          </div>
        </div>

        <Authenticated>
          <NotificationsInner />
        </Authenticated>

        <Unauthenticated>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Bell /></EmptyMedia>
              <EmptyTitle>سجّل دخولك لعرض الإشعارات</EmptyTitle>
              <EmptyDescription>ستصلك تنبيهات عند وصول رسائل أو تقييمات جديدة</EmptyDescription>
            </EmptyHeader>
            <SignInButton />
          </Empty>
        </Unauthenticated>

        <AuthLoading>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </AuthLoading>
      </main>
      <Footer />
    </div>
  );
}
