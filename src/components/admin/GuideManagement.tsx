import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Book, FolderOpen, Settings } from "lucide-react";
import { GuidesTable } from "./guides/GuidesTable";
import { GuideEditor } from "./guides/GuideEditor";
import { CategoriesTable } from "./guides/CategoriesTable";
import { CategoryEditor } from "./guides/CategoryEditor";

export function GuideManagement() {
  const [activeTab, setActiveTab] = useState("guides");
  const [isCreatingGuide, setIsCreatingGuide] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [editingGuide, setEditingGuide] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  if (isCreatingGuide || editingGuide) {
    return (
      <GuideEditor
        guideId={editingGuide}
        onBack={() => {
          setIsCreatingGuide(false);
          setEditingGuide(null);
        }}
      />
    );
  }

  if (isCreatingCategory || editingCategory) {
    return (
      <CategoryEditor
        categoryId={editingCategory}
        onBack={() => {
          setIsCreatingCategory(false);
          setEditingCategory(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[hsl(var(--text-strong))]">
            Guide Management
          </h1>
          <p className="text-[hsl(var(--text-muted))]">
            Manage your step-by-step guides and categories
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <Book size={16} />
            Guides
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen size={16} />
            Categories
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Guides</CardTitle>
                  <CardDescription>
                    Manage your step-by-step guides and tutorials
                  </CardDescription>
                </div>
                <Button onClick={() => setIsCreatingGuide(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Guide
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <GuidesTable onEditGuide={setEditingGuide} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>
                    Organize your guides into categories
                  </CardDescription>
                </div>
                <Button onClick={() => setIsCreatingCategory(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CategoriesTable onEditCategory={setEditingCategory} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guide Settings</CardTitle>
              <CardDescription>
                Configure guide display and behavior settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[hsl(var(--text-muted))]">
                Guide settings will be available in future updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}