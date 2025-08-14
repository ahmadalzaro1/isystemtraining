
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { WorkshopFilters } from "@/types/workshop";
import { Label } from "@/components/ui/label";

interface WorkshopFilterBarProps {
  filters: WorkshopFilters;
  onChange: (filters: WorkshopFilters) => void;
}

export const WorkshopFilterBar = ({ filters, onChange }: WorkshopFilterBarProps) => {
  const handleReset = () => {
    onChange({
      search: "",
      skillLevel: "All",
      category: "All"
    });
  };

  const handleCategoryClick = (category: string) => {
    onChange({
      ...filters,
      category: category as WorkshopFilters["category"]
    });
    // Show a visual feedback when category is selected
    const el = document.activeElement as HTMLElement;
    if (el) el.blur();
  };

  const categories = [
    { value: "All", label: "All Categories" },
    { value: "Mac", label: "💻 Mac" },
    { value: "iPhone", label: "📱 iPhone" },
    { value: "Apple Watch", label: "⌚ Apple Watch" },
    { value: "AI", label: "🤖 AI" },
    { value: "Digital Safety", label: "🔐 Digital Safety" },
    { value: "Creativity", label: "🎨 Creativity" },
    { value: "Productivity", label: "🚀 Productivity" },
    { value: "iCloud", label: "☁️ iCloud" }
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-[clamp(8px,2vw,12px)] top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))] h-[clamp(16px,3vw,20px)] w-[clamp(16px,3vw,20px)]" />
        <Input
          placeholder="Search workshops..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-[clamp(32px,6vw,40px)] min-h-[clamp(44px,6vw,48px)] text-[clamp(14px,2.8vw,16px)] bg-surface2 border-border focus:bg-background transition-colors w-full"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-[clamp(8px,2vw,12px)] top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))] hover:text-text-muted transition-colors"
          >
            <X className="h-[clamp(16px,3vw,20px)] w-[clamp(16px,3vw,20px)]" />
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-4">
        {/* Skill Level Filter - Carousel */}
        <div className="space-y-2">
          <Label className="text-[clamp(12px,2.5vw,14px)] font-medium text-text-muted">Skill Level</Label>
          <div className="relative">
            <div className="flex gap-[2%] overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => onChange({ ...filters, skillLevel: level as WorkshopFilters["skillLevel"] })}
                  className={`w-[30%] flex-none px-[2%] py-[clamp(12px,3vw,16px)] text-[clamp(14px,2.8vw,18px)] rounded-full bg-surface2 border border-[hsl(var(--border))] shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus whitespace-nowrap snap-start min-h-[44px] flex items-center justify-center ${
                    filters.skillLevel === level 
                      ? "border-[hsl(var(--accent-a))] bg-[hsl(var(--accent-a))/0.08] text-[hsl(var(--accent-a))]" 
                      : ""
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter - Full Width Grid */}
        <div className="space-y-2">
          <Label className="text-[clamp(12px,2.5vw,14px)] font-medium text-text-muted">Category</Label>
          <div className="grid grid-cols-3 gap-[2%]">
            {categories.slice(0, 3).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleCategoryClick(value)}
                className={`w-full px-[2%] py-[clamp(12px,3vw,16px)] text-[clamp(12px,2.2vw,14px)] rounded-full bg-surface2 border border-[hsl(var(--border))] shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus whitespace-nowrap min-h-[44px] flex items-center justify-center ${
                  filters.category === value 
                    ? "border-[hsl(var(--accent-a))] bg-[hsl(var(--accent-a))/0.08] text-[hsl(var(--accent-a))]" 
                    : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-[2%]">
            {categories.slice(3, 6).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleCategoryClick(value)}
                className={`w-full px-[2%] py-[clamp(12px,3vw,16px)] text-[clamp(12px,2.2vw,14px)] rounded-full bg-surface2 border border-[hsl(var(--border))] shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus whitespace-nowrap min-h-[44px] flex items-center justify-center ${
                  filters.category === value 
                    ? "border-[hsl(var(--accent-a))] bg-[hsl(var(--accent-a))/0.08] text-[hsl(var(--accent-a))]" 
                    : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-[2%]">
            {categories.slice(6).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleCategoryClick(value)}
                className={`w-full px-[2%] py-[clamp(12px,3vw,16px)] text-[clamp(12px,2.2vw,14px)] rounded-full bg-surface2 border border-[hsl(var(--border))] shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus whitespace-nowrap min-h-[44px] flex items-center justify-center ${
                  filters.category === value 
                    ? "border-[hsl(var(--accent-a))] bg-[hsl(var(--accent-a))/0.08] text-[hsl(var(--accent-a))]" 
                    : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        {(filters.search || filters.skillLevel !== "All" || filters.category !== "All") && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto animate-fade-in min-h-[clamp(44px,6vw,48px)] px-[clamp(16px,4vw,24px)] text-[clamp(14px,2.8vw,16px)]"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};
