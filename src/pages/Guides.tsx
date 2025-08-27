import React, { useState } from "react";
import { GuidesList } from "@/components/guides/GuidesList";
import { GuideCategories } from "@/components/guides/GuideCategories";

export default function Guides(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <>
      {/* SEO Meta Tags */}
      <title>Step-by-Step Guides | iSystem Training</title>
      <meta 
        name="description" 
        content="Comprehensive step-by-step guides for mastering various technologies and workflows. Learn at your own pace with detailed tutorials." 
      />
      <meta name="keywords" content="tutorials, guides, step-by-step, training, technology, learning" />
      <meta property="og:title" content="Step-by-Step Guides | iSystem Training" />
      <meta property="og:description" content="Comprehensive step-by-step guides for mastering various technologies and workflows." />
      <meta property="og:type" content="website" />

      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--surface))/0.3]">
        {/* Hero Section */}
        <section className="container-page py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[hsl(var(--text-strong))] mb-6">
              Step-by-Step Guides
            </h1>
            <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed max-w-2xl">
              Master new technologies and workflows with our comprehensive guides. 
              Each tutorial provides clear, actionable steps to help you achieve your goals.
            </p>
          </div>
        </section>

        {/* Guides Content */}
        <section className="container-page pb-24">
          <div className="space-y-12">
            <GuideCategories 
              selectedCategory={selectedCategory} 
              onCategoryChange={setSelectedCategory} 
            />
            <GuidesList selectedCategory={selectedCategory} />
          </div>
        </section>
      </div>
    </>
  );
}