import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce.ts";
import { CATEGORIES, SAUDI_CITIES } from "@/lib/marketplace.ts";
import ListingCard from "./_components/ListingCard.tsx";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import {
  Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription,
} from "@/components/ui/empty.tsx";
import { SearchX } from "lucide-react";

export default function MarketplacePage() {
  const [searchRaw, setSearchRaw] = useState("");
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [debouncedSearch] = useDebounce(searchRaw, 400);

  const { results, status, loadMore } = usePaginatedQuery(
    api.listings.listListings,
    {
      search: debouncedSearch.trim() || undefined,
      category: category !== "all" ? category : undefined,
      city: city !== "all" ? city : undefined,
    },
    { initialNumItems: 12 }
  );

  const hasActiveFilters = category !== "all" || city !== "all" || debouncedSearch;

  const clearFilters = () => {
    setSearchRaw("");
    setCategory("all");
    setCity("all");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      {/* Page Header */}
      <div className="bg-primary py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-primary-foreground mb-1">تصفح الإعلانات</h1>
          <p className="text-primary-foreground/70">آلاف الفرص في مكان واحد</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن إبل، أغنام، أعلاف..."
              value={searchRaw}
              onChange={(e) => setSearchRaw(e.target.value)}
              className="pr-9"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={showFilters ? "bg-primary text-primary-foreground" : ""}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-border p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">الفئة</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="كل الفئات" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.emoji} {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">المدينة</label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="كل المدن" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المدن</SelectItem>
                  {SAUDI_CITIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (
              <div className="flex items-end">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-destructive hover:text-destructive">
                  <X className="w-3 h-3" />
                  مسح الفلاتر
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap
                ${category === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-white border border-border text-foreground/70 hover:border-primary hover:text-primary"
                }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                بحث: {debouncedSearch}
                <button onClick={() => setSearchRaw("")} className="cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {city !== "all" && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                {city}
                <button onClick={() => setCity("all")} className="cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results count */}
        {status !== "LoadingFirstPage" && (
          <p className="text-sm text-muted-foreground mb-4">
            {results.length > 0 ? `${results.length} إعلان` : ""}
          </p>
        )}

        {/* Grid */}
        {status === "LoadingFirstPage" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
              <EmptyTitle>لا توجد إعلانات</EmptyTitle>
              <EmptyDescription>
                {hasActiveFilters ? "جرب تغيير الفلاتر أو مسحها" : "لا توجد إعلانات متاحة حاليًا"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((listing) => (
                <ListingCard key={listing._id} listing={listing} featured={listing.isFeatured} />
              ))}
            </div>

            {/* Load More */}
            {status === "CanLoadMore" && (
              <div className="flex justify-center mt-8">
                <Button variant="ghost" onClick={() => loadMore(12)} className="font-semibold border border-border">
                  تحميل المزيد
                </Button>
              </div>
            )}
            {status === "LoadingMore" && (
              <div className="flex justify-center mt-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
