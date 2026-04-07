import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  MapPin, Phone, MessageCircle, BadgeCheck, Star, Eye,
  ChevronRight, ChevronLeft, ArrowRight, Calendar,
  Tag, Ruler, Weight, Users, Shuffle
} from "lucide-react";
import { formatPrice, getCategoryLabel, getCategoryEmoji } from "@/lib/marketplace.ts";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils.ts";

function ListingDetailContent({ id }: { id: Id<"listings"> }) {
  const listing = useQuery(api.listings.getListingById, { id });
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);

  if (listing === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-muted-foreground text-lg">الإعلان غير موجود أو تم حذفه</p>
        <Button onClick={() => navigate("/marketplace")}>العودة للسوق</Button>
      </div>
    );
  }

  const images = listing.images.length > 0 ? listing.images : [];
  const hasImages = images.length > 0;

  const createdDate = listing.createdAt
    ? format(new Date(listing.createdAt), "d MMMM yyyy", { locale: ar })
    : null;

  const details = [
    listing.age && { icon: Calendar, label: "العمر", value: listing.age },
    listing.gender && {
      icon: Users,
      label: "الجنس",
      value: listing.gender === "male" ? "ذكر" : listing.gender === "female" ? "أنثى" : "مختلط",
    },
    listing.quantity && { icon: Shuffle, label: "الكمية", value: `${listing.quantity} رأس` },
    listing.weight && { icon: Weight, label: "الوزن", value: listing.weight },
    listing.breed && { icon: Tag, label: "السلالة", value: listing.breed },
    listing.subCategory && { icon: Ruler, label: "النوع", value: listing.subCategory },
  ].filter(Boolean) as Array<{ icon: React.ElementType; label: string; value: string }>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8" dir="rtl">
      {/* Back button */}
      <button
        onClick={() => navigate("/marketplace")}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 cursor-pointer transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        العودة إلى السوق
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="relative aspect-video bg-muted">
              {hasImages ? (
                <>
                  <img
                    src={images[imageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors shadow-sm"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors shadow-sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImageIndex(i)}
                            className={cn(
                              "w-2 h-2 rounded-full cursor-pointer transition-all",
                              i === imageIndex ? "bg-white w-4" : "bg-white/50"
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                    <Eye className="w-3 h-3" />
                    {listing.views} مشاهدة
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  {getCategoryEmoji(listing.category)}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
                      i === imageIndex ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <h1 className="text-2xl font-black text-foreground leading-tight">{listing.title}</h1>
              <div>
                <div className="text-2xl font-black text-primary">{formatPrice(listing.price)}</div>
                {listing.priceType === "negotiable" && (
                  <span className="text-xs text-muted-foreground">قابل للتفاوض</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="gap-1">
                <span>{getCategoryEmoji(listing.category)}</span>
                {getCategoryLabel(listing.category)}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <MapPin className="w-3 h-3" />
                {listing.city}
                {listing.region && ` - ${listing.region}`}
              </Badge>
              {createdDate && (
                <Badge variant="secondary" className="gap-1 text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {createdDate}
                </Badge>
              )}
            </div>

            {/* Animal Details */}
            {details.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 p-4 bg-muted/40 rounded-xl">
                {details.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">{label}</div>
                      <div className="text-xs font-semibold text-foreground">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Sidebar — Seller Card + Actions */}
        <div className="space-y-4">
          {/* Seller Card */}
          {listing.user && (
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-bold text-foreground mb-4 text-sm">معلومات البائع</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg overflow-hidden flex-shrink-0">
                  {listing.user.avatarUrl ? (
                    <img src={listing.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    listing.user.name?.[0] ?? "م"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm truncate">{listing.user.name ?? "بائع"}</span>
                    {listing.user.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  {listing.user.city && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {listing.user.city}
                    </div>
                  )}
                  {listing.user.rating > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-semibold">{listing.user.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({listing.user.ratingCount})</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full gap-2 font-bold"
                  onClick={() => toast.info("ميزة المحادثة قادمة قريبًا في مرحلة قادمة!")}
                >
                  <MessageCircle className="w-4 h-4" />
                  تواصل مع البائع
                </Button>
                {listing.user.phone && (
                  <Button
                    variant="secondary"
                    className="w-full gap-2 font-semibold"
                    onClick={() => toast.info("ميزة المحادثة قادمة قريبًا في مرحلة قادمة!")}
                  >
                    <Phone className="w-4 h-4" />
                    اتصل الآن
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Safety Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h4 className="font-bold text-amber-800 text-sm mb-2">نصائح للأمان</h4>
            <ul className="text-xs text-amber-700 space-y-1.5">
              <li>• تحقق من البائع قبل الدفع</li>
              <li>• لا تدفع مسبقًا دون فحص البضاعة</li>
              <li>• استخدم اتفاقية الالتزام</li>
              <li>• أبلغ عن أي إعلان مشبوه</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate("/marketplace");
    return null;
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <ListingDetailContent id={id as Id<"listings">} />
      <Footer />
    </div>
  );
}
