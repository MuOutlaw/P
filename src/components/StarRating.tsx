import { Star } from "lucide-react";
import { cn } from "@/lib/utils.ts";

type Props = {
  score: number;      // 0–5, supports decimals
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  count?: number;
};

const SIZES = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };

export default function StarRating({ score, maxStars = 5, size = "md", showNumber = false, count }: Props) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const fill = Math.min(Math.max(score - i, 0), 1); // 0, 0.5, or 1
          return (
            <span key={i} className="relative">
              {/* Empty star */}
              <Star className={cn(SIZES[size], "text-muted-foreground/25")} />
              {/* Filled overlay */}
              {fill > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star className={cn(SIZES[size], "text-yellow-400 fill-yellow-400")} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-foreground">{score.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
