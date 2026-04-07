import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import ContactSellerDialog from "./_components/ContactSellerDialog.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { toast } from "sonner";
import {
  MapPin, Phone, MessageCircle, BadgeCheck, Star,
  Tag, Eye, Calendar, ArrowRight, Share2, ChevronLeft, ChevronRight,
  Weight, Dna, Users,
} from "lucide-react";
import { getCategoryLabel, getCategoryEmoji, timeAgo } from "@/lib/marketplace.ts";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { useEffect } from "react";

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-muted rounded-2xl flex items-center justify-center">
        <span className="text-6xl opacity-40">🐪</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-black">
        <img
          src={images[current]}
          alt={title}
          className="w-full h-full object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${i === current ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-colors ${
                i === current ? "border-primary" : "border-transparent"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ListingDetailContent({ id }: { id: Id<"listings"> }) {
  const listing = useQuery(api.listings.queries.getById, { id });
  const incrementViews = useMutation(api.listings.mutations.incrementViews);
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);

  // Increment view count once
  useEffect(() => {
    if (listing) {
      incrementViews({ id }).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing?._id]);

  if (listing === undefined) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground text-lg">الإعلان غير موجود أو تم حذفه</p>
        <Button className="mt-4" onClick={() => navigate("/marketplace")}>العودة للسوق</Button>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({ title: listing.title, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ رابط الإعلان");
    }
  };

  const sellerInitials = listing.seller?.name
    ? listing.seller.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
    : "م";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" dir="rtl">
      {/* Back nav */}
      <button
        onClick={() => navigate("/marketplace")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 cursor-pointer transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للسوق
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={listing.images} title={listing.title} />

          {/* Title & Meta */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl font-black text-foreground leading-tight">{listing.title}</h1>
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors flex-shrink-0"
              >
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                {getCategoryEmoji(listing.category)} {getCategoryLabel(listing.category)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {listing.city}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {listing.views} مشاهدة
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {timeAgo(listing.createdAt)}
              </span>

              {listing.status === "sold" && (
                <Badge variant="destructive">مُباع</Badge>
              )}
              {listing.isFeatured && (
                <Badge className="bg-accent text-accent-foreground">إعلان مميّز</Badge>
              )}
            </div>

            {/* Price */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
              <Tag className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-black text-primary">
                  {listing.price.toLocaleString("ar-SA")} ريال
                </div>
                {listing.priceType === "negotiable" && (
                  <div className="text-xs text-muted-foreground mt-0.5">قابل للتفاوض</div>
                )}
              </div>
            </div>
          </div>

          {/* Livestock Specs */}
          {(listing.age || listing.gender || listing.quantity || listing.weight || listing.breed) && (
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-bold text-foreground mb-4">تفاصيل الحيوان</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {listing.quantity && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-muted-foreground text-xs">العدد</div>
                      <div className="font-semibold">{listing.quantity} رأس</div>
                    </div>
                  </div>
                )}
                {listing.age && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-muted-foreground text-xs">العمر</div>
                      <div className="font-semibold">{listing.age}</div>
                    </div>
                  </div>
                )}
                {listing.gender && (
                  <div className="flex items-center gap-2 text-sm">
                    <Dna className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-muted-foreground text-xs">الجنس</div>
                      <div className="font-semibold">
                        {listing.gender === "male" ? "ذكر" : listing.gender === "female" ? "أنثى" : "مختلط"}
                      </div>
                    </div>
                  </div>
                )}
                {listing.weight && (
                  <div className="flex items-center gap-2 text-sm">
                    <Weight className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-muted-foreground text-xs">الوزن</div>
                      <div className="font-semibold">{listing.weight}</div>
                    </div>
                  </div>
                )}
                {listing.breed && (
                  <div className="flex items-center gap-2 text-sm">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-muted-foreground text-xs">السلالة</div>
                      <div className="font-semibold">{listing.breed}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-bold text-foreground mb-3">وصف الإعلان</h3>
            <p className="text-muted-foreground text-sm leading-loose whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Right: Seller Card + Actions */}
        <div className="space-y-4">
          {/* Seller Card */}
          {listing.seller && (
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-20">
              <h3 className="font-bold text-foreground mb-4 text-sm text-muted-foreground">البائع</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {listing.seller.avatarUrl ? (
                    <img src={listing.seller.avatarUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                  ) : sellerInitials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(`/users/${listing.userId}`)}
                      className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors"
                    >
                      {listing.seller.name ?? "بائع"}
                    </button>
                    {listing.seller.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  {listing.seller.rating > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {listing.seller.rating.toFixed(1)} ({listing.seller.ratingCount ?? 0})
                    </div>
                  )}
                  {listing.seller.city && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {listing.seller.city}
                    </div>
                  )}
                </div>
              </div>

              <Authenticated>
                <div className="space-y-2">
                  <Button className="w-full font-semibold gap-2" onClick={() => setContactOpen(true)}>
                    <MessageCircle className="w-4 h-4" />
                    مراسلة البائع
                  </Button>
                  {listing.seller.phone && (
                    <Button
                      variant="secondary"
                      className="w-full font-semibold gap-2"
                      onClick={() => toast.info(`رقم البائع: ${listing.seller?.phone}`)}
                    >
                      <Phone className="w-4 h-4" />
                      عرض رقم الجوال
                    </Button>
                  )}
                </div>
              </Authenticated>

              <Unauthenticated>
                <div className="space-y-2">
                  <SignInButton>
                    <Button className="w-full font-semibold gap-2">
                      <MessageCircle className="w-4 h-4" />
                      سجّل للتواصل مع البائع
                    </Button>
                  </SignInButton>
                </div>
              </Unauthenticated>
            </div>
          )}

          {/* Safety Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h4 className="font-bold text-amber-800 text-sm mb-2">نصائح الأمان</h4>
            <ul className="text-xs text-amber-700 space-y-1.5 list-disc list-inside">
              <li>لا تدفع أي مبلغ قبل معاينة الحيوان</li>
              <li>تحقق من هوية البائع قبل الشراء</li>
              <li>استخدم نظام اتفاقية الالتزام للحماية</li>
              <li>تجنب التحويل لحسابات غير معروفة</li>
            </ul>
          </div>
        </div>
      </div>

      {listing.seller && (
        <ContactSellerDialog
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          sellerId={listing.userId}
          sellerName={listing.seller.name ?? "البائع"}
          listingId={listing._id}
          listingTitle={listing.title}
        />
      )}
    </div>
  );
}

export default function ListingDetailPage() {
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
