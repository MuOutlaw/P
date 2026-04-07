import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Zap, Star, Tag, MapPin } from "lucide-react";
import { getCategoryEmoji, getCategoryLabel } from "@/lib/marketplace.ts";

export default function FeaturedListingsSection() {
  const listings = useQuery(api.boosts.queries.getFeaturedListings, {});
  const navigate = useNavigate();

  if (listings === undefined) {
    return (
      <section className="py-10 px-4 max-w-7xl mx-auto" dir="rtl">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-black text-foreground">الإعلانات المميّزة</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!listings.length) return null;

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-black text-foreground">الإعلانات المميّزة</h2>
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
            {listings.length} إعلان
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <button
            key={listing._id}
            onClick={() => navigate(`/listings/${listing._id}`)}
            className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-right group"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
              {listing.images[0] ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {getCategoryEmoji(listing.category)}
                </div>
              )}
              <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-amber-900" /> مميّز
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="font-bold text-foreground text-xs leading-snug line-clamp-2 mb-2">
                {listing.title}
              </p>
              <div className="flex items-center gap-1 text-primary font-black text-sm mb-1.5">
                <Tag className="w-3 h-3" />
                {listing.price.toLocaleString("ar-SA")}
                <span className="text-[10px] font-normal text-muted-foreground">ريال</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {listing.city}
                <span className="mx-1">·</span>
                {getCategoryLabel(listing.category)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
