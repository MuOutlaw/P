import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent,
} from "@/components/ui/empty.tsx";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Plus, MoreVertical, Eye, Edit, CheckCircle2, RotateCcw, Trash2, Tag, MapPin, ShoppingBag, Zap,
} from "lucide-react";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import { getCategoryEmoji, getCategoryLabel, timeAgo } from "@/lib/marketplace.ts";
import BoostListingDialog from "./_components/BoostListingDialog.tsx";

type Listing = {
  _id: Id<"listings">;
  title: string;
  price: number;
  priceType: string;
  category: string;
  city: string;
  images: string[];
  status: "active" | "sold" | "draft";
  views: number;
  isFeatured: boolean;
  createdAt: string;
};

function ListingRow({ listing, onRefresh }: { listing: Listing; onRefresh: () => void }) {
  const navigate = useNavigate();
  const removeListing = useMutation(api.listings.mutations.remove);
  const markAsSold = useMutation(api.listings.mutations.markAsSold);
  const reactivate = useMutation(api.listings.mutations.reactivate);
  const [boostOpen, setBoostOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;
    try {
      await removeListing({ id: listing._id });
      toast.success("تم حذف الإعلان");
      onRefresh();
    } catch (err) {
      if (err instanceof ConvexError) {
        toast.error((err.data as { message: string }).message);
      } else {
        toast.error("فشل حذف الإعلان");
      }
    }
  };

  const handleMarkSold = async () => {
    try {
      await markAsSold({ id: listing._id });
      toast.success("تم تعليم الإعلان كمُباع");
    } catch {
      toast.error("فشلت العملية");
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivate({ id: listing._id });
      toast.success("تم إعادة تفعيل الإعلان");
    } catch {
      toast.error("فشلت العملية");
    }
  };

  const statusConfig = {
    active: { label: "نشط", variant: "default" as const, className: "bg-green-100 text-green-800 border-green-200" },
    sold: { label: "مُباع", variant: "secondary" as const, className: "bg-red-100 text-red-800 border-red-200" },
    draft: { label: "مسودة", variant: "outline" as const, className: "bg-gray-100 text-gray-700 border-gray-200" },
  };

  const sc = statusConfig[listing.status];

  return (
    <div className="bg-white rounded-2xl border border-border p-4 flex gap-4 hover:shadow-sm transition-shadow">
      {/* Thumbnail */}
      <div
        className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted cursor-pointer"
        onClick={() => navigate(`/listings/${listing._id}`)}
      >
        {listing.images[0] ? (
          <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {getCategoryEmoji(listing.category)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-bold text-foreground text-sm leading-snug line-clamp-2 cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate(`/listings/${listing._id}`)}
          >
            {listing.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted cursor-pointer flex-shrink-0">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => navigate(`/listings/${listing._id}`)}
              >
                <Eye className="w-4 h-4" /> عرض الإعلان
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => navigate(`/listings/${listing._id}/edit`)}
              >
                <Edit className="w-4 h-4" /> تعديل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {listing.status === "active" && (
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={handleMarkSold}>
                  <CheckCircle2 className="w-4 h-4" /> تعليم كمُباع
                </DropdownMenuItem>
              )}
              {listing.status === "sold" && (
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={handleReactivate}>
                  <RotateCcw className="w-4 h-4" /> إعادة تفعيل
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" /> حذف الإعلان
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${sc.className}`}>
            {sc.label}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {getCategoryEmoji(listing.category)} {getCategoryLabel(listing.category)}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {listing.city}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-black text-primary text-sm flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {listing.price.toLocaleString("ar-SA")} ريال
          </span>
          <div className="flex items-center gap-2">
            {listing.isFeatured && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                ⭐ مميّز
              </span>
            )}
            {listing.status === "active" && (
              <button
                onClick={() => setBoostOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
              >
                <Zap className="w-3 h-3" />
                تمييز
              </button>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" /> {listing.views} · {timeAgo(listing.createdAt)}
            </span>
          </div>
        </div>

      </div>

      {boostOpen && (
        <BoostListingDialog
          open={boostOpen}
          onClose={() => setBoostOpen(false)}
          listingId={listing._id}
          listingTitle={listing.title}
        />
      )}
    </div>
  );
}

function MyListingsContent() {
  const navigate = useNavigate();
  const currentUser = useQuery(api.users.getCurrentUser, {});
  const listings = useQuery(
    api.listings.queries.getByUser,
    currentUser ? { userId: currentUser._id } : "skip",
  );

  const isLoading = currentUser === undefined || listings === undefined;

  const activeCount = listings?.filter((l) => l.status === "active").length ?? 0;
  const soldCount = listings?.filter((l) => l.status === "sold").length ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">إعلاناتي</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            أدر إعلاناتك وتابع أداءها
          </p>
        </div>
        <Button
          className="font-semibold gap-2"
          onClick={() => navigate("/create-listing")}
        >
          <Plus className="w-4 h-4" />
          إعلان جديد
        </Button>
      </div>

      {/* Stats */}
      {!isLoading && listings && listings.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "الإجمالي", value: listings.length },
            { label: "نشط", value: activeCount },
            { label: "مُباع", value: soldCount },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-border p-3 text-center">
              <div className="text-xl font-black text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Listings */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4 flex gap-4">
              <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : listings && listings.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon"><ShoppingBag /></EmptyMedia>
            <EmptyTitle>لا توجد إعلانات بعد</EmptyTitle>
            <EmptyDescription>انشر إعلانك الأول الآن وابدأ البيع</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => navigate("/create-listing")} className="font-semibold gap-2">
              <Plus className="w-4 h-4" />
              نشر إعلان
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="space-y-3">
          {(listings as Listing[]).map((listing) => (
            <ListingRow
              key={listing._id}
              listing={listing}
              onRefresh={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <AuthLoading>
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-muted-foreground">يجب تسجيل الدخول لعرض إعلاناتك</p>
          <SignInButton><Button className="font-bold">تسجيل الدخول</Button></SignInButton>
        </div>
      </Unauthenticated>
      <Authenticated><MyListingsContent /></Authenticated>
      <Footer />
    </div>
  );
}
