import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "../_components/Navbar.tsx";
import ImageUploader from "./_components/ImageUploader.tsx";
import { CATEGORIES, SAUDI_CITIES } from "@/lib/marketplace.ts";

const LIVESTOCK_CATEGORIES = ["camels", "sheep", "cattle", "goats"];

const formSchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل").max(100),
  description: z.string().min(20, "الوصف يجب أن يكون 20 حرفًا على الأقل").max(2000),
  price: z.coerce.number().min(1, "السعر يجب أن يكون أكبر من صفر"),
  priceType: z.enum(["fixed", "negotiable"]),
  category: z.string().min(1, "اختر الفئة"),
  city: z.string().min(1, "اختر المدينة"),
  quantity: z.coerce.number().min(1).optional(),
  age: z.string().max(30).optional(),
  gender: z.enum(["male", "female", "mixed"]).optional(),
  weight: z.string().max(30).optional(),
  breed: z.string().max(60).optional(),
});

type FormData = z.infer<typeof formSchema>;

function CreateListingForm() {
  const navigate = useNavigate();
  const createListing = useMutation(api.listings.mutations.create);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageStorageIds, setImageStorageIds] = useState<Id<"_storage">[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { priceType: "negotiable" },
  });

  const category = watch("category");
  const isLivestock = LIVESTOCK_CATEGORIES.includes(category);

  const handleImagesChange = (urls: string[], ids: Id<"_storage">[]) => {
    setImageUrls(urls);
    setImageStorageIds(ids);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const id = await createListing({
        title: data.title,
        description: data.description,
        price: data.price,
        priceType: data.priceType,
        category: data.category,
        city: data.city,
        imageStorageIds,
        quantity: data.quantity,
        age: data.age || undefined,
        gender: data.gender || undefined,
        weight: data.weight || undefined,
        breed: data.breed || undefined,
      });
      setSubmitted(true);
      setTimeout(() => navigate(`/listings/${id}`), 1500);
    } catch (err) {
      if (err instanceof ConvexError) {
        const { message } = err.data as { message: string };
        toast.error(message);
      } else {
        toast.error("حدث خطأ، حاول مجددًا");
      }
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-black text-foreground">تم نشر إعلانك بنجاح!</h2>
        <p className="text-muted-foreground text-sm">جاري التحويل لصفحة الإعلان...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground">نشر إعلان جديد</h1>
          <p className="text-sm text-muted-foreground">أضف تفاصيل إعلانك بوضوح لجذب المشترين</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section: Basic Info */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
          <h2 className="font-bold text-foreground border-b border-border pb-3">المعلومات الأساسية</h2>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>الفئة <span className="text-destructive">*</span></Label>
            <Select
              value={watch("category") ?? ""}
              onValueChange={(v) => setValue("category", v, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="اختر فئة الإعلان" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-destructive text-xs">{errors.category.message}</p>}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">عنوان الإعلان <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder={
                isLivestock ? "مثال: ٥ رؤوس إبل مجاهيم للبيع — الرياض"
                : "اكتب عنوانًا واضحًا لإعلانك"
              }
              {...register("title")}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">وصف الإعلان <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              placeholder="صف حالة الحيوان، سببب البيع، الصحة، التطعيمات، وأي تفاصيل مهمة..."
              rows={5}
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            <div className="flex justify-between">
              {errors.description
                ? <p className="text-destructive text-xs">{errors.description.message}</p>
                : <span />}
              <span className="text-xs text-muted-foreground">{(watch("description") ?? "").length}/2000</span>
            </div>
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label>المدينة <span className="text-destructive">*</span></Label>
            <Select
              value={watch("city") ?? ""}
              onValueChange={(v) => setValue("city", v, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.city ? "border-destructive" : ""}>
                <SelectValue placeholder="اختر مدينتك" />
              </SelectTrigger>
              <SelectContent>
                {SAUDI_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && <p className="text-destructive text-xs">{errors.city.message}</p>}
          </div>
        </div>

        {/* Section: Pricing */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
          <h2 className="font-bold text-foreground border-b border-border pb-3">السعر</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">السعر (ريال) <span className="text-destructive">*</span></Label>
              <Input
                id="price"
                type="number"
                min={1}
                placeholder="0"
                dir="ltr"
                {...register("price")}
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && <p className="text-destructive text-xs">{errors.price.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>نوع السعر</Label>
              <Select
                value={watch("priceType")}
                onValueChange={(v) => setValue("priceType", v as "fixed" | "negotiable")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="negotiable">قابل للتفاوض</SelectItem>
                  <SelectItem value="fixed">سعر ثابت</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section: Livestock Details (conditional) */}
        {isLivestock && (
          <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
            <h2 className="font-bold text-foreground border-b border-border pb-3">تفاصيل الحيوان</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="quantity">العدد (رأس)</Label>
                <Input id="quantity" type="number" min={1} placeholder="1" dir="ltr" {...register("quantity")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="age">العمر</Label>
                <Input id="age" placeholder="مثال: ٣ سنوات" {...register("age")} />
              </div>
              <div className="space-y-1.5">
                <Label>الجنس</Label>
                <Select
                  value={watch("gender") ?? ""}
                  onValueChange={(v) => setValue("gender", v as "male" | "female" | "mixed")}
                >
                  <SelectTrigger><SelectValue placeholder="اختر الجنس" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                    <SelectItem value="mixed">مختلط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight">الوزن</Label>
                <Input id="weight" placeholder="مثال: ٢٥٠ كغ" {...register("weight")} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="breed">السلالة / النوع</Label>
                <Input id="breed" placeholder="مثال: مجاهيم، نجدي، هولشتاين..." {...register("breed")} />
              </div>
            </div>
          </div>
        )}

        {/* Section: Images */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-bold text-foreground border-b border-border pb-3">الصور</h2>
          <ImageUploader
            value={imageUrls}
            storageIds={imageStorageIds}
            onChange={handleImagesChange}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full font-black text-base py-6 gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جارٍ النشر..." : "نشر الإعلان الآن"}
        </Button>
      </form>
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <AuthLoading>
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-muted-foreground text-lg">يجب تسجيل الدخول لنشر إعلان</p>
          <SignInButton>
            <Button size="lg" className="font-bold">تسجيل الدخول</Button>
          </SignInButton>
        </div>
      </Unauthenticated>
      <Authenticated>
        <CreateListingForm />
      </Authenticated>
    </div>
  );
}
