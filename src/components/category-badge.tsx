import { CATEGORY_COLORS, Category } from "@/lib/mock-data";

export function CategoryDot({ category }: { category: Category }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-background"
      style={{ backgroundColor: CATEGORY_COLORS[category] }}
    />
  );
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[category] }} />
      {category}
    </span>
  );
}
