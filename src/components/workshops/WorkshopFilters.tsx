
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))] h-4 w-4" />
        <Input
          placeholder="Search workshops..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-10 bg-surface2 border-border focus:bg-background transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))] hover:text-text-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-4">
        {/* Skill Level Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-text-muted">Skill Level</Label>
          <RadioGroup
            value={filters.skillLevel}
            onValueChange={(value) => 
              onChange({ ...filters, skillLevel: value as WorkshopFilters["skillLevel"] })
            }
            className="flex flex-wrap gap-2"
          >
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <Label
                key={level}
              className={`px-4 py-2 rounded-full bg-surface2 border border-[hsl(var(--border))] shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus ${
                  filters.skillLevel === level 
                    ? "border-[hsl(var(--accent-a))] bg-[hsl(var(--accent-a))/0.08] text-[hsl(var(--accent-a))]" 
                    : ""
                }`}
              >
                <RadioGroupItem value={level} className="sr-only" />
                {level}
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-text-muted">Category</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleCategoryClick(value)}
                 className={`px-4 py-2 rounded-full bg-surface2 border border-[hsl(var(--border))] shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus ${
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
            className="w-full sm:w-auto animate-fade-in"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};
