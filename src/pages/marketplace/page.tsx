import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, SAUDI_CITIES } from "@/lib/marketplace.ts";
import ListingCard from "./_components/ListingCard.tsx";
import FeaturedListingsSection from "./_components/FeaturedListingsSection.tsx";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import { useDebounce } from "@/hooks/use-debounce.ts";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag } from "lucide-react";

export default function MarketplacePage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [showFilters, setShowFilters] = useState(false);

  const isSearching = debouncedSearch.trim().length > 0;

  const { results, status, loadMore } = usePaginatedQuery(
    api.listings.queries.list,
    {
      category: category !== "all" ? category : undefined,
      city: city !== "all" ? city : undefined,
      sortBy,
    },
    { initialNumItems: 12 }
  );

  const searchResults = useQuery(
    api.listings.queries.search,
    isSearching
      ? {
          query: debouncedSearch,
          category: category !== "all" ? category : undefined,
          city: city !== "all" ? city : undefined,
        }
      : "skip"
  );

  const displayedListings = isSearching ? (searchResults ?? []) : results;
  const isLoading = isSearching
    ? searchResults === undefined
    : status === "LoadingFirstPage";

  const activeFilters = [
    category !== "all" && category,
    city !== "all" && city,
    sortBy !== "newest" && (sortBy === "price_asc" ? "السعر: الأقل" : "السعر: الأعلى"),
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      <FeaturedListingsSection />

      {/* Page Header */}
      <div className="bg-primary pt-10 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-primary-foreground mb-2">السوق</h1>
          <p className="text-primary-foreground/70 mb-6">تصفح آلاف الإعلانات من تجار موثوقين</p>

          {/* Search */}
          <div className="bg-white rounded-xl flex items-center gap-2 p-2 shadow-lg max-w-2xl">
            <Search className="w-4 h-4 text-muted-foreground mr-1 flex-shrink-0" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث عن ناقة، خروف، علف..."
              className="border-0 bg-transparent focus-visible:ring-0 flex-1"
            />
            {searchInput && (
              <button onClick={() => setSearchInput("")} className="cursor-pointer text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
            <Button className="font-semibold px-5 flex-shrink-0">بحث</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Category Tabs */}
        <div className="bg-white rounded-2xl border border-border p-3 mb-6 shadow-sm overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  category === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
              showFilters || activeFilters.length > 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white border-border text-foreground hover:bg-muted"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            فلترة
            {activeFilters.length > 0 && (
              <span className="bg-white/20 text-inherit text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Active filter chips */}
          <AnimatePresence>
            {activeFilters.map((f) => (
              <motion.span
                key={f}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {f}
                <button
                  onClick={() => {
                    if (f === city) setCity("all");
                    else if (f === category) setCategory("all");
                    else setSortBy("newest");
                  }}
                  className="cursor-pointer hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>

          <div className="mr-auto">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-44 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث أولًا</SelectItem>
                <SelectItem value="price_asc">السعر: الأقل</SelectItem>
                <SelectItem value="price_desc">السعر: الأعلى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-border p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">المدينة</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع المدن" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المدن</SelectItem>
                      {SAUDI_CITIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => { setCity("all"); setCategory("all"); setSortBy("newest"); setShowFilters(false); }}
                  >
                    مسح الفلاتر
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedListings.length === 0 ? (
          <Empty className="py-20">
            <EmptyHeader>
              <EmptyMedia variant="icon"><ShoppingBag /></EmptyMedia>
              <EmptyTitle>لا توجد إعلانات</EmptyTitle>
              <EmptyDescription>
                {isSearching ? "لم نجد نتائج لبحثك، جرب كلمات مختلفة" : "لا توجد إعلانات في هذه الفئة حاليًا"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {isSearching
                ? `${displayedListings.length} نتيجة لـ "${debouncedSearch}"`
                : `${displayedListings.length}+ إعلان`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
              {displayedListings.map((listing) => (
                <ListingCard key={listing._id} {...listing} />
              ))}
            </div>

            {!isSearching && status === "CanLoadMore" && (
              <div className="flex justify-center pb-10">
                <Button
                  variant="ghost"
                  size="lg"
                  className="font-semibold border border-border"
                  onClick={() => loadMore(12)}
                >
                  تحميل المزيد
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
