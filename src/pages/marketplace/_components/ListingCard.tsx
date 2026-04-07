import { Doc } from "@/convex/_generated/dataModel.js";
import { BadgeCheck, MapPin, Eye, Star, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice, getCategoryEmoji } from "@/lib/marketplace.ts";
import { cn } from "@/lib/utils.ts";

type ListingWithUser = Doc<"listings"> & {
  user: Doc<"users"> | null;
};

type Props = {
  listing: ListingWithUser;
  featured?: boolean;
};

const PLACEHOLDER_COLORS: Record<string, string> = {
  camels: "from-amber-100 to-amber-200",
  sheep: "from-emerald-100 to-emerald-200",
  cattle: "from-stone-100 to-stone-200",
  goats: "from-lime-100 to-lime-200",
  feed: "from-yellow-100 to-yellow-200",
  farms: "from-green-100 to-green-200",
  services: "from-blue-100 to-blue-200",
  transport: "from-slate-100 to-slate-200",
};

export default function ListingCard({ listing, featured = false }: Props) {
  const navigate = useNavigate();
  const placeholderGradient = PLACEHOLDER_COLORS[listing.category] ?? "from-muted to-muted/60";

  return (
    <div
      onClick={() => navigate(`/listing/${listing._id}`)}
      className={cn(
        "bg-white rounded-2xl border border-border overflow-hidden cursor-pointer",
        "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group",
        featured && "ring-2 ring-accent/60"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center text-5xl", placeholderGradient)}>
            {getCategoryEmoji(listing.category)}
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {featured && (
            <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              مميز
            </span>
          )}
          {listing.priceType === "negotiable" && (
            <span className="bg-white/90 text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">
              قابل للتفاوض
            </span>
          )}
        </div>
        {/* Views */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">
          <Eye className="w-3 h-3" />
          {listing.views}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2 mb-1">
          {listing.title}
        </h3>

        <div className="text-lg font-black text-primary mb-2">
          {formatPrice(listing.price)}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{listing.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{getCategoryEmoji(listing.category)}</span>
          </div>
        </div>

        {/* Seller info */}
        {listing.user && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
              {listing.user.name?.[0] ?? "م"}
            </div>
            <span className="text-xs text-muted-foreground truncate flex-1">
              {listing.user.name ?? "بائع"}
            </span>
            {listing.user.isVerified && (
              <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            )}
            {listing.user.rating > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">{listing.user.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
