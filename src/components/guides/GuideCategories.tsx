import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GuideCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function GuideCategories({ selectedCategory, onCategoryChange }: GuideCategoriesProps) {
  const { data: categories } = useQuery({
    queryKey: ["guide-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guide_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[hsl(var(--text-strong))]">
        Browse by Category
      </h3>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange("All")}
          className="transition-all duration-200"
        >
          All
        </Button>
        {categories?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.slug ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.slug)}
            className="transition-all duration-200"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}