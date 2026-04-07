import { Authenticated, Unauthenticated, AuthLoading, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowRight, Save } from "lucide-react";
import { ConvexError } from "convex/values";
import Navbar from "../../_components/Navbar.tsx";

const SAUDI_CITIES = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام",
  "الخبر", "تبوك", "بريدة", "أبها", "الطائف", "حائل", "نجران",
  "الجوف", "الباحة", "عرعر", "جازان", "ينبع", "خميس مشيط",
];

const profileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(60),
  phone: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().max(200, "النبذة لا تتجاوز ٢٠٠ حرف").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

function EditProfileContent() {
  const user = useQuery(api.users.getCurrentUser, {});
  const updateProfile = useMutation(api.users.updateProfile);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  // Populate form once user loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        phone: user.phone ?? "",
        city: user.city ?? "",
        bio: user.bio ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone ?? undefined,
        city: data.city ?? undefined,
        bio: data.bio ?? undefined,
      });
      toast.success("تم تحديث الملف الشخصي بنجاح");
      navigate("/profile");
    } catch (err) {
      if (err instanceof ConvexError) {
        const { message } = err.data as { message: string };
        toast.error(message);
      } else {
        toast.error("حدث خطأ، حاول مجددًا");
      }
    }
  };

  if (user === undefined) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const bioValue = watch("bio") ?? "";

  return (
    <div className="max-w-lg mx-auto px-4 py-10" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/profile")}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground">تعديل الملف الشخصي</h1>
          <p className="text-sm text-muted-foreground">أكمل بياناتك لزيادة ثقة المشترين والبائعين</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">الاسم الكامل <span className="text-destructive">*</span></Label>
          <Input
            id="name"
            placeholder="محمد العتيبي"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone">رقم الجوال</Label>
          <Input
            id="phone"
            placeholder="05xxxxxxxx"
            dir="ltr"
            {...register("phone")}
          />
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <Label>المدينة</Label>
          <Select
            value={watch("city") ?? ""}
            onValueChange={(val) => setValue("city", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر مدينتك" />
            </SelectTrigger>
            <SelectContent>
              {SAUDI_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <Label htmlFor="bio">نبذة تعريفية</Label>
          <Textarea
            id="bio"
            placeholder="أخبر الآخرين عن تخصصك وخبرتك في التداول..."
            rows={4}
            {...register("bio")}
          />
          <div className="flex justify-between">
            {errors.bio ? (
              <p className="text-destructive text-xs">{errors.bio.message}</p>
            ) : <span />}
            <span className="text-xs text-muted-foreground">{bioValue.length}/200</span>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full font-bold text-base py-5 gap-2"
          disabled={isSubmitting}
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </Button>
      </form>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <AuthLoading>
        <div className="max-w-lg mx-auto px-4 py-10 space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-muted-foreground text-lg">يجب تسجيل الدخول أولًا</p>
          <SignInButton>
            <Button size="lg" className="font-bold">تسجيل الدخول</Button>
          </SignInButton>
        </div>
      </Unauthenticated>
      <Authenticated>
        <EditProfileContent />
      </Authenticated>
    </div>
  );
}
