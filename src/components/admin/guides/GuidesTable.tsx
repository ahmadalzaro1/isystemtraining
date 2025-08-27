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
import { Edit2, Eye, Trash2, Globe, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GuidesTableProps {
  onEditGuide: (guideId: string) => void;
}

export function GuidesTable({ onEditGuide }: GuidesTableProps) {
  const { data: guides, isLoading, refetch } = useQuery({
    queryKey: ["admin-guides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select(`
          *,
          guide_categories (
            name,
            slug
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (guideId: string) => {
    if (!confirm("Are you sure you want to delete this guide?")) return;

    const { error } = await supabase
      .from("guides")
      .delete()
      .eq("id", guideId);

    if (error) {
      toast.error("Failed to delete guide");
      return;
    }

    toast.success("Guide deleted successfully");
    refetch();
  };

  const togglePublished = async (guideId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("guides")
      .update({ 
        is_published: !currentStatus,
        published_at: !currentStatus ? new Date().toISOString() : null 
      })
      .eq("id", guideId);

    if (error) {
      toast.error("Failed to update guide status");
      return;
    }

    toast.success(`Guide ${!currentStatus ? "published" : "unpublished"} successfully`);
    refetch();
  };

  if (isLoading) {
    return <div className="p-8 text-center text-[hsl(var(--text-muted))]">Loading guides...</div>;
  }

  if (!guides?.length) {
    return (
      <div className="p-8 text-center text-[hsl(var(--text-muted))]">
        No guides found. Create your first guide to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Read Time</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guides.map((guide) => (
          <TableRow key={guide.id}>
            <TableCell>
              <div>
                <p className="font-medium text-[hsl(var(--text-strong))]">
                  {guide.title}
                </p>
                <p className="text-sm text-[hsl(var(--text-muted))] truncate max-w-xs">
                  {guide.description}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {guide.guide_categories?.name || "Uncategorized"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {guide.is_published ? (
                  <>
                    <Globe size={14} className="text-green-600" />
                    <span className="text-green-600">Published</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} className="text-[hsl(var(--text-muted))]" />
                    <span className="text-[hsl(var(--text-muted))]">Draft</span>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>
              {guide.read_time ? `${guide.read_time} min` : "-"}
            </TableCell>
            <TableCell>{guide.view_count || 0}</TableCell>
            <TableCell>
              {new Date(guide.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePublished(guide.id, guide.is_published)}
                >
                  {guide.is_published ? <Lock size={14} /> : <Eye size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditGuide(guide.id)}
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(guide.id)}
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