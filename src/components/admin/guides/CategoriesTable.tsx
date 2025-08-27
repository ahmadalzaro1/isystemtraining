import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CategoriesTableProps {
  onEditCategory: (categoryId: string) => void;
}

export function CategoriesTable({ onEditCategory }: CategoriesTableProps) {
  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ["admin-guide-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guide_categories")
        .select(`
          *,
          guides (count)
        `)
        .order("sort_order");

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This will also delete all guides in this category.")) {
      return;
    }

    const { error } = await supabase
      .from("guide_categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      toast.error("Failed to delete category");
      return;
    }

    toast.success("Category deleted successfully");
    refetch();
  };

  const toggleActive = async (categoryId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("guide_categories")
      .update({ is_active: !currentStatus })
      .eq("id", categoryId);

    if (error) {
      toast.error("Failed to update category status");
      return;
    }

    toast.success(`Category ${!currentStatus ? "activated" : "deactivated"} successfully`);
    refetch();
  };

  if (isLoading) {
    return <div className="p-8 text-center text-[hsl(var(--text-muted))]">Loading categories...</div>;
  }

  if (!categories?.length) {
    return (
      <div className="p-8 text-center text-[hsl(var(--text-muted))]">
        No categories found. Create your first category to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Guides</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Order</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {category.icon && (
                  <div className="w-5 h-5 flex items-center justify-center">
                    {/* Icon would be rendered here based on category.icon */}
                  </div>
                )}
                <span className="font-medium text-[hsl(var(--text-strong))]">
                  {category.name}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <code className="text-sm bg-[hsl(var(--surface-2))] px-2 py-1 rounded">
                {category.slug}
              </code>
            </TableCell>
            <TableCell>
              <p className="text-sm text-[hsl(var(--text-muted))] truncate max-w-xs">
                {category.description || "-"}
              </p>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {category.guides?.[0]?.count || 0} guides
              </Badge>
            </TableCell>
            <TableCell>
              {category.is_active ? (
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary">
                  Inactive
                </Badge>
              )}
            </TableCell>
            <TableCell>{category.sort_order}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActive(category.id, category.is_active)}
                >
                  {category.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditCategory(category.id)}
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}