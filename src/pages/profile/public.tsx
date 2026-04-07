import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { BadgeCheck, MapPin, Calendar, MessageCircle, Star, ArrowRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import StarRating from "@/components/StarRating.tsx";
import RateUserDialog from "./_components/RateUserDialog.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { toast } from "sonner";

function RatingDistribution({ ratings }: { ratings: { score: number }[] }) {
  const total = ratings.length;
  if (total === 0) return null;
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((n) => {
        const count = ratings.filter((r) => r.score === n).length;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={n} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-4 text-left">{n}</span>
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-yellow-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-4 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

function PublicProfileContent({ userId }: { userId: Id<"users"> }) {
  const navigate = useNavigate();
  const [rateOpen, setRateOpen] = useState(false);
  const user = useQuery(api.users.getUserById, { userId });
  const ratings = useQuery(api.ratings.queries.getForUser, { userId });
  const myRating = useQuery(api.ratings.queries.getMyRatingForUser, { ratedUserId: userId });
  const startConversation = useMutation(api.messages.mutations.startConversation);
  const currentUser = useQuery(api.users.getCurrentUser, {});

  if (user === undefined || ratings === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground">المستخدم غير موجود</p>
        <Button className="mt-4" onClick={() => navigate("/marketplace")}>العودة للسوق</Button>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userId;
  const joinDate = user.joinedAt
    ? format(new Date(user.joinedAt), "MMMM yyyy", { locale: ar })
    : null;
  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
    : "م";

  const handleMessage = async () => {
    if (!currentUser) return;
    try {
      const convId = await startConversation({
        otherUserId: userId,
        initialMessage: "السلام عليكم، أود التواصل معك.",
      });
      navigate(`/messages/${convId}`);
    } catch (err) {
      if (err instanceof ConvexError) {
        const d = err.data as { message: string };
        toast.error(d.message);
      } else {
        toast.error("فشل بدء المحادثة");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 cursor-pointer transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        رجوع
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-5">
        <div className="h-24 bg-gradient-to-l from-primary to-primary/70" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-primary border-4 border-white shadow-md flex items-center justify-center text-primary-foreground font-black text-2xl overflow-hidden shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name ?? ""} className="w-full h-full object-cover" />
              ) : initials}
            </div>
            {/* Actions */}
            <div className="pb-1 flex gap-2">
              {!isOwnProfile && (
                <>
                  <Authenticated>
                    <Button size="sm" variant="secondary" className="gap-1.5 font-semibold" onClick={handleMessage}>
                      <MessageCircle className="w-4 h-4" />
                      مراسلة
                    </Button>
                    <Button size="sm" className="gap-1.5 font-semibold" onClick={() => setRateOpen(true)}>
                      <Star className="w-4 h-4" />
                      {myRating ? "تعديل تقييمي" : "قيّم"}
                    </Button>
                  </Authenticated>
                  <Unauthenticated>
                    <SignInButton>
                      <Button size="sm" className="gap-1.5 font-semibold">
                        <Star className="w-4 h-4" />
                        قيّم
                      </Button>
                    </SignInButton>
                  </Unauthenticated>
                </>
              )}
              {isOwnProfile && (
                <Button size="sm" variant="secondary" onClick={() => navigate("/profile")}>
                  ملفي الشخصي
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-black text-foreground">{user.name ?? "مستخدم"}</h1>
            {user.isVerified && (
              <Badge className="gap-1 text-xs bg-primary/10 text-primary border-primary/20">
                <BadgeCheck className="w-3 h-3" /> موثّق
              </Badge>
            )}
          </div>

          {user.rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating score={user.rating} size="md" showNumber count={user.ratingCount} />
            </div>
          )}

          {user.bio && (
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {user.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />{user.city}
              </span>
            )}
            {joinDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />عضو منذ {joinDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-foreground text-lg">التقييمات</h2>
          <span className="text-sm text-muted-foreground">{ratings.length} تقييم</span>
        </div>

        {ratings.length > 0 && (
          <div className="flex items-start gap-6 mb-6 pb-5 border-b border-border">
            {/* Big score */}
            <div className="text-center shrink-0">
              <div className="text-5xl font-black text-foreground">{user.rating.toFixed(1)}</div>
              <StarRating score={user.rating} size="sm" />
              <div className="text-xs text-muted-foreground mt-1">{ratings.length} تقييم</div>
            </div>
            {/* Distribution bars */}
            <div className="flex-1">
              <RatingDistribution ratings={ratings} />
            </div>
          </div>
        )}

        {ratings.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Star /></EmptyMedia>
              <EmptyTitle>لا توجد تقييمات بعد</EmptyTitle>
              <EmptyDescription>كن أول من يقيّم هذا المستخدم</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-4">
            {ratings.map((r) => (
              <div key={r._id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {r.rater?.name?.charAt(0) ?? "م"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm">{r.rater?.name ?? "مستخدم"}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true, locale: ar })}
                    </span>
                  </div>
                  <StarRating score={r.score} size="sm" />
                  {r.listing && (
                    <button
                      onClick={() => navigate(`/listings/${r.listing!._id}`)}
                      className="text-xs text-primary hover:underline mt-0.5 cursor-pointer"
                    >
                      بخصوص: {r.listing.title}
                    </button>
                  )}
                  {r.comment && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{r.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating dialog */}
      {!isOwnProfile && (
        <RateUserDialog
          open={rateOpen}
          onClose={() => setRateOpen(false)}
          ratedUserId={userId}
          ratedUserName={user.name ?? "المستخدم"}
        />
      )}
    </div>
  );
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) { navigate("/marketplace"); return null; }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <AuthLoading>
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </AuthLoading>
      <PublicProfileContent userId={id as Id<"users">} />
      <Footer />
    </div>
  );
}
