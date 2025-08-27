import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "Development", 
  "Version Control",
  "JavaScript",
  "Database",
  "Security",
  "Design"
];

export function GuideCategories() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[hsl(var(--text-strong))]">
        Browse by Category
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="transition-all duration-200"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}