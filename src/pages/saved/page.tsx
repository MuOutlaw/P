import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Tag, BadgeCheck, Eye, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import { getCategoryEmoji, getCategoryLabel, timeAgo } from "@/lib/marketplace.ts";
import { toast } from "sonner";
import { motion } from "motion/react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

type SavedListing = {
  _id: Id<"listings">;
  title: string;
  price: number;
  priceType: string;
  category: string;
  city: string;
  images: string[];
  views: number;
  isFeatured: boolean;
  createdAt: string;
  status: string;
  savedAt: string;
  sellerName: string;
  sellerRating: number;
  sellerIsVerified: boolean;
};

function SavedCard({ listing }: { listing: SavedListing }) {
  const navigate = useNavigate();
  const toggleSave = useMutation(api.savedListings.toggleSave);
  const image = listing.images[0];

  const handleUnsave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleSave({ listingId: listing._id });
      toast.success("تم إلغاء الحفظ");
    } catch {
      toast.error("حدث خطأ");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => navigate(`/listings/${listing._id}`)}
      className="bg-white rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <span className="text-4xl">{getCategoryEmoji(listing.category)}</span>
            <span className="text-xs">{getCategoryLabel(listing.category)}</span>
          </div>
        )}

        {listing.isFeatured && (
          <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            ⭐ مميّز
          </div>
        )}

        {listing.status === "sold" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full text-sm">تم البيع</span>
          </div>
        )}

        <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {listing.views}
        </div>

        <button
          onClick={handleUnsave}
          className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md cursor-pointer"
          title="إلغاء الحفظ"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2 flex-1">{listing.title}</h3>
          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
            {getCategoryEmoji(listing.category)} {getCategoryLabel(listing.category)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-primary font-black text-lg mb-3">
          <Tag className="w-3.5 h-3.5" />
          {listing.price.toLocaleString("ar-SA")}
          <span className="text-xs font-normal text-muted-foreground">
            ريال{listing.priceType === "negotiable" ? " · قابل للتفاوض" : ""}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {listing.city}
          </div>
          <div className="flex items-center gap-1 max-w-[120px]">
            {listing.sellerIsVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
            <span className="truncate">{listing.sellerName}</span>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground/60 text-left" dir="ltr">
          {timeAgo(listing.createdAt)}
        </div>
      </div>
    </motion.div>
  );
}

function SavedListingsInner() {
  const saved = useQuery(api.savedListings.getMySaved, {});

  if (saved === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><Heart /></EmptyMedia>
          <EmptyTitle>لا توجد إعلانات محفوظة</EmptyTitle>
          <EmptyDescription>احفظ الإعلانات التي تعجبك للرجوع إليها لاحقاً</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => window.location.href = "/marketplace"}>تصفح الإعلانات</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-6">{saved.length} إعلان محفوظ</p>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {(saved as SavedListing[]).map((listing) => (
          <SavedCard key={listing._id} listing={listing} />
        ))}
      </motion.div>
    </div>
  );
}

export default function SavedListingsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">الإعلانات المحفوظة</h1>
            <p className="text-sm text-muted-foreground">الإعلانات التي أعجبتك وحفظتها</p>
          </div>
        </div>

        <Authenticated>
          <SavedListingsInner />
        </Authenticated>

        <Unauthenticated>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Heart /></EmptyMedia>
              <EmptyTitle>سجّل دخولك لعرض المحفوظات</EmptyTitle>
              <EmptyDescription>احفظ الإعلانات التي تعجبك وارجع إليها في أي وقت</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <SignInButton />
            </EmptyContent>
          </Empty>
        </Unauthenticated>

        <AuthLoading>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </AuthLoading>
      </main>
      <Footer />
    </div>
  );
}
