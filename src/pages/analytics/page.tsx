import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty.tsx";
import Navbar from "../_components/Navbar.tsx";
import Footer from "../_components/Footer.tsx";
import { useNavigate } from "react-router-dom";
import {
  Eye, Heart, MessageCircle, TrendingUp, ShoppingBag,
  Star, BarChart2, Tag, BadgeCheck, Zap,
} from "lucide-react";
import { getCategoryLabel, getCategoryEmoji } from "@/lib/marketplace.ts";
import { motion } from "motion/react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

// ─── Palette ────────────────────────────────────────────────────────────────
const CHART_COLORS = ["#16a34a", "#2563eb", "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#be185d"];

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, sub, color = "bg-primary/10 text-primary", delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-2xl font-black text-foreground leading-tight">
          {typeof value === "number" ? value.toLocaleString("ar-SA") : value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── Top Listings Table ──────────────────────────────────────────────────────
type ListingStat = {
  _id: Id<"listings">;
  title: string;
  category: string;
  price: number;
  views: number;
  saves: number;
  inquiries: number;
  status: string;
  isFeatured: boolean;
};

function TopListingsTable({ listings }: { listings: ListingStat[] }) {
  const navigate = useNavigate();
  if (listings.length === 0) return (
    <p className="text-sm text-muted-foreground text-center py-6">لا توجد إعلانات نشطة بعد</p>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="text-right pb-3 font-medium pl-2">الإعلان</th>
            <th className="text-center pb-3 font-medium px-3"><Eye className="w-3.5 h-3.5 inline" /></th>
            <th className="text-center pb-3 font-medium px-3"><Heart className="w-3.5 h-3.5 inline" /></th>
            <th className="text-center pb-3 font-medium px-3"><MessageCircle className="w-3.5 h-3.5 inline" /></th>
            <th className="text-right pb-3 font-medium">السعر</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr
              key={l._id}
              onClick={() => navigate(`/listings/${l._id}`)}
              className="border-b border-border/50 last:border-0 cursor-pointer hover:bg-muted/40 transition-colors"
            >
              <td className="py-3 pl-2">
                <div className="flex items-center gap-2 max-w-[200px]">
                  <span className="text-base">{getCategoryEmoji(l.category)}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{l.title}</p>
                    <p className="text-xs text-muted-foreground">{getCategoryLabel(l.category)}</p>
                  </div>
                  {l.isFeatured && (
                    <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border-amber-200 flex-shrink-0">
                      مميّز
                    </Badge>
                  )}
                </div>
              </td>
              <td className="py-3 px-3 text-center font-bold text-foreground">{l.views.toLocaleString("ar-SA")}</td>
              <td className="py-3 px-3 text-center text-red-500 font-bold">{l.saves}</td>
              <td className="py-3 px-3 text-center text-blue-500 font-bold">{l.inquiries}</td>
              <td className="py-3 text-right font-bold text-primary">{l.price.toLocaleString("ar-SA")} ر</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Dashboard Content ──────────────────────────────────────────────────
function AnalyticsDashboardInner() {
  const navigate = useNavigate();
  const data = useQuery(api.analytics.queries.getMyAnalytics, {});

  if (data === undefined) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><BarChart2 /></EmptyMedia>
          <EmptyTitle>تعذّر تحميل الإحصائيات</EmptyTitle>
          <EmptyDescription>حاول إعادة تحميل الصفحة</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (data.totalListings === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><BarChart2 /></EmptyMedia>
          <EmptyTitle>لا توجد إعلانات بعد</EmptyTitle>
          <EmptyDescription>انشر إعلانك الأول لتبدأ بتتبع الأداء والإحصائيات</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => navigate("/create-listing")}>+ نشر إعلان</Button>
        </EmptyContent>
      </Empty>
    );
  }

  const categoryData = data.categoryBreakdown.map((c) => ({
    name: getCategoryLabel(c.category),
    value: c.count,
    emoji: getCategoryEmoji(c.category),
  }));

  return (
    <div className="space-y-8">
      {/* Summary Stats Grid */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-4">نظرة عامة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<ShoppingBag className="w-5 h-5" />}  label="الإعلانات النشطة"  value={data.activeListings}  sub={`من ${data.totalListings} إعلان`}       color="bg-primary/10 text-primary"   delay={0} />
          <StatCard icon={<Eye className="w-5 h-5" />}           label="إجمالي المشاهدات" value={data.totalViews}      sub="على جميع إعلاناتك"                       color="bg-blue-100 text-blue-600"    delay={0.05} />
          <StatCard icon={<Heart className="w-5 h-5" />}         label="إجمالي الحفظ"     value={data.totalSaves}      sub="أضافها مستخدمون لمفضلتهم"               color="bg-red-100 text-red-500"      delay={0.1} />
          <StatCard icon={<MessageCircle className="w-5 h-5" />} label="الاستفسارات"       value={data.totalInquiries}  sub="رسائل وارده عن إعلاناتك"               color="bg-indigo-100 text-indigo-600" delay={0.15} />
          <StatCard icon={<Tag className="w-5 h-5" />}           label="إجمالي المبيعات"  value={`${data.totalRevenue.toLocaleString("ar-SA")} ر`} sub={`${data.soldListings} إعلان مُباع`} color="bg-green-100 text-green-600"  delay={0.2} />
          <StatCard icon={<Star className="w-5 h-5" />}          label="تقييمك"           value={data.avgRating > 0 ? data.avgRating.toFixed(1) : "—"} sub={`${data.ratingCount} تقييم`} color="bg-amber-100 text-amber-600"  delay={0.25} />
          <StatCard icon={<Zap className="w-5 h-5" />}           label="الإعلانات المميّزة" value={data.allListingStats.filter((l) => l.isFeatured).length} sub="إعلان مدفوع التميز" color="bg-purple-100 text-purple-600" delay={0.3} />
          <StatCard icon={<BadgeCheck className="w-5 h-5" />}    label="الإعلانات المسودة" value={data.draftListings}   sub="غير منشورة بعد"                         color="bg-muted text-muted-foreground" delay={0.35} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Views Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">المشاهدات أسبوعياً</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.weeklyViews} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v: number) => [v.toLocaleString("ar-SA"), "مشاهدات"]}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="views" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">توزيع الفئات</h3>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [v, "إعلان"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">لا توجد بيانات</p>
          )}
        </motion.div>
      </div>

      {/* Top Listings by Views */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-border p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">أداء الإعلانات</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/my-listings")}>
            عرض الكل
          </Button>
        </div>
        <TopListingsTable listings={data.topByViews} />
      </motion.div>

      {/* All Listings Performance Table */}
      {data.allListingStats.length > 5 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded-2xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">جميع الإعلانات</h3>
          </div>
          <TopListingsTable listings={data.allListingStats} />
        </motion.div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalyticsDashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">لوحة إحصائيات البائع</h1>
            <p className="text-sm text-muted-foreground">تتبع أداء إعلاناتك ومشاهداتك وأرباحك</p>
          </div>
        </div>

        <Authenticated>
          <AnalyticsDashboardInner />
        </Authenticated>

        <Unauthenticated>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><BarChart2 /></EmptyMedia>
              <EmptyTitle>سجّل دخولك لعرض الإحصائيات</EmptyTitle>
              <EmptyDescription>تتبع مشاهدات إعلاناتك واستفساراتك وأدائك</EmptyDescription>
            </EmptyHeader>
            <EmptyContent><SignInButton /></EmptyContent>
          </Empty>
        </Unauthenticated>

        <AuthLoading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        </AuthLoading>
      </main>
      <Footer />
    </div>
  );
}
