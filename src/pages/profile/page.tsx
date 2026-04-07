import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { BadgeCheck, MapPin, Star, Phone, Calendar, Edit, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import StarRating from "@/components/StarRating.tsx";

function ProfileContent() {
  const user = useQuery(api.users.getCurrentUser, {});
  const myListings = useQuery(api.listings.queries.getMyListings, {});
  const myRatings = useQuery(api.ratings.queries.getForUser, user ? { userId: user._id } : "skip");
  const navigate = useNavigate();

  if (user === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!user) return null;

  const joinDate = user.joinedAt
    ? format(new Date(user.joinedAt), "MMMM yyyy", { locale: ar })
    : null;

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : "م";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-l from-primary to-primary/70 relative">
          <button
            onClick={() => navigate("/profile/edit")}
            className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-colors"
          >
            <Edit className="w-3 h-3" />
            تعديل الملف
          </button>
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-primary border-4 border-white shadow-md flex items-center justify-center text-primary-foreground font-black text-2xl overflow-hidden flex-shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name ?? ""} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-foreground">{user.name ?? "مستخدم جديد"}</h1>
                {user.isVerified && (
                  <BadgeCheck className="w-5 h-5 text-primary fill-primary/10" />
                )}
              </div>
              {user.rating > 0 && (
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating score={user.rating} size="sm" showNumber count={user.ratingCount} />
            </div>
          )}
            </div>
          </div>

          {user.bio && (
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {user.city && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{user.city}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-primary" />
                <span dir="ltr">{user.phone}</span>
              </div>
            )}
            {joinDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                <span>عضو منذ {joinDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "الإعلانات", value: myListings !== undefined ? myListings.length.toString() : "—" },
          { label: "الصفقات المُكتملة", value: myListings !== undefined ? myListings.filter(l => l.status === "sold").length.toString() : "—" },
          { label: "التقييم", value: user.rating > 0 ? user.rating.toFixed(1) : "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-4 text-center">
            <div className="text-2xl font-black text-primary mb-0.5">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ratings received */}
      {myRatings && myRatings.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-foreground">تقييماتك</h2>
            <span className="text-sm text-muted-foreground">{myRatings.length} تقييم</span>
          </div>
          <div className="space-y-4">
            {myRatings.slice(0, 3).map((r) => (
              <div key={r._id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {r.rater?.name?.charAt(0) ?? "م"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{r.rater?.name ?? "مستخدم"}</span>
                  </div>
                  <StarRating score={r.score} size="sm" />
                  {r.comment && <p className="text-xs text-muted-foreground mt-0.5">{r.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Banner */}
      {!user.isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800 text-sm">وثّق حسابك واحصل على الشارة الخضراء</p>
            <p className="text-amber-700 text-xs mt-0.5">يزداد ثقة المشترين بالحسابات الموثقة بنسبة ٣ أضعاف</p>
          </div>
          <button className="flex items-center gap-1 text-amber-700 font-semibold text-sm cursor-pointer whitespace-nowrap">
            ابدأ التوثيق
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Complete Profile Prompt */}
      {(!user.phone || !user.city || !user.bio) && (
        <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-primary text-sm">أكمل ملفك الشخصي</p>
            <p className="text-muted-foreground text-xs mt-0.5">أضف رقم جوالك ومدينتك لزيادة ظهورك</p>
          </div>
          <Button size="sm" onClick={() => navigate("/profile/edit")} className="font-semibold">
            أكمل الملف
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <AuthLoading>
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-10 w-48" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-muted-foreground text-lg">يجب تسجيل الدخول لعرض ملفك الشخصي</p>
          <SignInButton>
            <Button size="lg" className="font-bold">تسجيل الدخول</Button>
          </SignInButton>
        </div>
      </Unauthenticated>
      <Authenticated>
        <ProfileContent />
      </Authenticated>
      <Footer />
    </div>
  );
}
