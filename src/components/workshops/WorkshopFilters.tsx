
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { WorkshopFilters } from "@/types/workshop";
import { Label } from "@/components/ui/label";

interface WorkshopFiltersProps {
  filters: WorkshopFilters;
  onChange: (filters: WorkshopFilters) => void;
}

export const WorkshopFilters = ({ filters, onChange }: WorkshopFiltersProps) => {
  const handleReset = () => {
    onChange({
      search: "",
      skillLevel: "All",
      category: "All"
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search workshops..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-4">
        {/* Skill Level Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Skill Level</Label>
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
                className={`px-4 py-2 rounded-full border cursor-pointer transition-all hover:bg-gray-50 ${
                  filters.skillLevel === level 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-gray-200"
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
          <Label className="text-sm font-medium text-gray-700">Category</Label>
          <RadioGroup
            value={filters.category}
            onValueChange={(value) => 
              onChange({ ...filters, category: value as WorkshopFilters["category"] })
            }
            className="flex flex-wrap gap-2"
          >
            {["All", "Productivity", "Creativity", "Privacy & Security", "Business & Enterprise"].map((category) => (
              <Label
                key={category}
                className={`px-4 py-2 rounded-full border cursor-pointer transition-all hover:bg-gray-50 ${
                  filters.category === category 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-gray-200"
                }`}
              >
                <RadioGroupItem value={category} className="sr-only" />
                {category}
              </Label>
            ))}
          </RadioGroup>
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
