import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GuideEditorProps {
  guideId?: string | null;
  onBack: () => void;
}

export function GuideEditor({ guideId, onBack }: GuideEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    category_id: "",
    author: "",
    read_time: "",
    difficulty_level: "Beginner",
    featured_image_url: "",
    is_published: false,
    is_featured: false,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  const queryClient = useQueryClient();

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

  const { data: guide, isLoading } = useQuery({
    queryKey: ["guide", guideId],
    queryFn: async () => {
      if (!guideId) return null;
      
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("id", guideId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!guideId,
  });

  useEffect(() => {
    if (guide) {
      setFormData({
        title: guide.title || "",
        slug: guide.slug || "",
        description: guide.description || "",
        content: guide.content || "",
        category_id: guide.category_id || "",
        author: guide.author || "",
        read_time: guide.read_time?.toString() || "",
        difficulty_level: guide.difficulty_level || "Beginner",
        featured_image_url: guide.featured_image_url || "",
        is_published: guide.is_published || false,
        is_featured: guide.is_featured || false,
        meta_title: guide.meta_title || "",
        meta_description: guide.meta_description || "",
        meta_keywords: guide.meta_keywords?.join(", ") || "",
      });
    }
  }, [guide]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const guideData = {
        ...data,
        read_time: data.read_time ? parseInt(data.read_time) : null,
        meta_keywords: data.meta_keywords ? data.meta_keywords.split(",").map(k => k.trim()) : [],
        published_at: data.is_published ? (guide?.published_at || new Date().toISOString()) : null,
      };

      if (guideId) {
        const { error } = await supabase
          .from("guides")
          .update(guideData)
          .eq("id", guideId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("guides")
          .insert([guideData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(guideId ? "Guide updated successfully" : "Guide created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-guides"] });
      onBack();
    },
    onError: (error) => {
      console.error("Error saving guide:", error);
      toast.error("Failed to save guide");
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.category_id) {
      toast.error("Category is required");
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
            Back to Guides
          </Button>
          <h1 className="text-3xl font-semibold text-[hsl(var(--text-strong))]">
            {guideId ? "Edit Guide" : "Create Guide"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye size={16} className="mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            <Save size={16} className="mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter guide title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the guide"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your guide content here (Markdown supported)..."
                  rows={20}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={formData.difficulty_level}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Guide author"
                />
              </div>

              <div>
                <Label htmlFor="read_time">Read Time (minutes)</Label>
                <Input
                  id="read_time"
                  type="number"
                  value={formData.read_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
                  placeholder="Estimated read time"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">Published</Label>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                />
              </div>

              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO title (optional)"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO description (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="meta_keywords">Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}