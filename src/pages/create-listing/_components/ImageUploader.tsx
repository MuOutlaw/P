import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  value: string[];            // resolved temporary URLs for preview
  storageIds: Id<"_storage">[];
  onChange: (urls: string[], ids: Id<"_storage">[]) => void;
  maxImages?: number;
};

export default function ImageUploader({ value, storageIds, onChange, maxImages = 6 }: Props) {
  const generateUploadUrl = useMutation(api.listings.mutations.generateUploadUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = maxImages - value.length;
    if (remaining <= 0) {
      toast.error(`الحد الأقصى ${maxImages} صور`);
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const newUrls: string[] = [];
      const newIds: Id<"_storage">[] = [];

      for (const file of selected) {
        if (!file.type.startsWith("image/")) {
          toast.error("يُسمح فقط بملفات الصور");
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("حجم الصورة يجب أن يكون أقل من 5 ميغابايت");
          continue;
        }

        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json() as { storageId: Id<"_storage"> };

        // Use a local object URL for immediate preview
        const previewUrl = URL.createObjectURL(file);
        newUrls.push(previewUrl);
        newIds.push(storageId);
      }

      onChange([...value, ...newUrls], [...storageIds, ...newIds]);
    } catch {
      toast.error("فشل رفع الصورة، حاول مجددًا");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    const newIds = storageIds.filter((_, i) => i !== index);
    onChange(newUrls, newIds);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {value.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                رئيسية
              </div>
            )}
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-5 h-5" />
                <span className="text-xs font-medium">إضافة صورة</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {value.length}/{maxImages} صور · الصورة الأولى ستكون الغلاف · الحجم الأقصى 5MB
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
