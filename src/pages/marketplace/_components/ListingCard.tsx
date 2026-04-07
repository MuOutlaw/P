import { BadgeCheck, Eye, Heart, MapPin, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { getCategoryEmoji, getCategoryLabel, timeAgo } from "@/lib/marketplace.ts";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { useAuth } from "@/hooks/use-auth.ts";
import { toast } from "sonner";
import { cn } from "@/lib/utils.ts";

type ListingCardProps = {
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
  seller: { name?: string; isVerified: boolean; rating: number } | null;
};

function SaveButton({ listingId }: { listingId: Id<"listings"> }) {
  const { user } = useAuth();
  const isSaved = useQuery(api.savedListings.isSaved, user ? { listingId } : "skip");
  const toggleSave = useMutation(api.savedListings.toggleSave);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("يجب تسجيل الدخول لحفظ الإعلانات");
      return;
    }
    try {
      const result = await toggleSave({ listingId });
      toast.success(result.saved ? "تم حفظ الإعلان ❤️" : "تم إلغاء الحفظ");
    } catch {
      toast.error("حدث خطأ، حاول مجدداً");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "absolute bottom-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer",
        isSaved
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white/80 backdrop-blur-sm text-muted-foreground hover:bg-white hover:text-red-500"
      )}
      title={isSaved ? "إلغاء الحفظ" : "حفظ الإعلان"}
    >
      <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
    </button>
  );
}

export default function ListingCard(props: ListingCardProps) {
  const navigate = useNavigate();
  const {
    _id, title, price, priceType, category, city,
    images, views, isFeatured, createdAt, seller,
  } = props;

  const image = images[0];

  return (
    <div
      onClick={() => navigate(`/listings/${_id}`)}
      className="bg-white rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <span className="text-4xl">{getCategoryEmoji(category)}</span>
            <span className="text-xs">{getCategoryLabel(category)}</span>
          </div>
        )}

        {isFeatured && (
          <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            ⭐ مميّز
          </div>
        )}

        <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {views}
        </div>

        <SaveButton listingId={_id} />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2 flex-1">{title}</h3>
          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
            {getCategoryEmoji(category)} {getCategoryLabel(category)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-primary font-black text-lg mb-3">
          <Tag className="w-3.5 h-3.5" />
          {price.toLocaleString("ar-SA")}
          <span className="text-xs font-normal text-muted-foreground">
            ريال{priceType === "negotiable" ? " · قابل للتفاوض" : ""}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {city}
          </div>

          {seller && (
            <div className="flex items-center gap-1 max-w-[120px]">
              {seller.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
              <span className="truncate">{seller.name ?? "بائع"}</span>
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-muted-foreground/60 text-left" dir="ltr">
          {timeAgo(createdAt)}
        </div>
      </div>
    </div>
  );
}
