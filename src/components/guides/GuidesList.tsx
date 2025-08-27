import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GuideCard } from "./GuideCard";

interface GuidesListProps {
  selectedCategory: string;
}

export function GuidesList({ selectedCategory }: GuidesListProps) {
  const { data: guides, isLoading } = useQuery({
    queryKey: ["guides", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("guides")
        .select(`
          *,
          guide_categories (
            name,
            slug
          )
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "All") {
        // Join with categories and filter by slug
        query = query.eq("guide_categories.slug", selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-[hsl(var(--surface-2))] h-48 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  const filteredGuides = guides || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[hsl(var(--text-strong))]">
          All Guides
        </h2>
        <p className="text-[hsl(var(--text-muted))]">
          {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              title={guide.title}
              description={guide.description || ""}
              category={guide.guide_categories?.name || "Uncategorized"}
              readTime={`${guide.read_time || 5} min`}
              author={guide.author || "iSystem Team"}
              href={`/guides/${guide.slug}`}
            />
          ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[hsl(var(--text-muted))] text-lg">
            No guides found for the selected category.
          </p>
        </div>
      )}
    </div>
  );
}