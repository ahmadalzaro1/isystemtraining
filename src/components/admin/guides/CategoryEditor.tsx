import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CategoryEditorProps {
  categoryId?: string | null;
  onBack: () => void;
}

export function CategoryEditor({ categoryId, onBack }: CategoryEditorProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    sort_order: "",
    is_active: true,
  });

  const queryClient = useQueryClient();

  const { data: category, isLoading } = useQuery({
    queryKey: ["guide-category", categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      
      const { data, error } = await supabase
        .from("guide_categories")
        .select("*")
        .eq("id", categoryId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!categoryId,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        icon: category.icon || "",
        sort_order: category.sort_order?.toString() || "",
        is_active: category.is_active || true,
      });
    }
  }, [category]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const categoryData = {
        ...data,
        sort_order: data.sort_order ? parseInt(data.sort_order) : 0,
      };

      if (categoryId) {
        const { error } = await supabase
          .from("guide_categories")
          .update(categoryData)
          .eq("id", categoryId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("guide_categories")
          .insert([categoryData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(categoryId ? "Category updated successfully" : "Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-guide-categories"] });
      queryClient.invalidateQueries({ queryKey: ["guide-categories"] });
      onBack();
    },
    onError: (error) => {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-[hsl(var(--text-muted))]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Categories
          </Button>
          <h1 className="text-3xl font-semibold text-[hsl(var(--text-strong))]">
            {categoryId ? "Edit Category" : "Create Category"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={saveMutation.isPending}>
          <Save size={16} className="mr-2" />
          {saveMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter category name"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-friendly-slug"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the category"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Lucide icon name (e.g., Shield, Brain, Users)"
              />
            </div>

            <div>
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                placeholder="0"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}