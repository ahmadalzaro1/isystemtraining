import React, { useState } from "react";
import { GuideCard } from "./GuideCard";

// Sample guide data - this would typically come from a CMS or database
const sampleGuides = [
  {
    id: "1",
    title: "Setting Up Your Development Environment",
    description: "A comprehensive guide to setting up a modern development environment with the latest tools and best practices.",
    category: "Development",
    readTime: "15 min read",
    author: "Tech Team",
    href: "#"
  },
  {
    id: "2", 
    title: "Git Workflow Best Practices",
    description: "Learn how to implement effective Git workflows in your team. Covers branching strategies, commit conventions, and collaboration tips.",
    category: "Version Control",
    readTime: "12 min read",
    author: "DevOps Team",
    href: "#"
  },
  {
    id: "3",
    title: "Debugging Common JavaScript Issues",
    description: "Master the art of debugging JavaScript applications. Learn techniques, tools, and strategies for identifying and fixing bugs efficiently.",
    category: "JavaScript",
    readTime: "20 min read", 
    author: "Frontend Team",
    href: "#"
  },
  {
    id: "4",
    title: "Database Design Fundamentals",
    description: "Essential principles for designing scalable and efficient databases. Covers normalization, indexing, and performance optimization.",
    category: "Database",
    readTime: "18 min read",
    author: "Backend Team", 
    href: "#"
  },
  {
    id: "5",
    title: "API Security Best Practices",
    description: "Secure your APIs with industry-standard practices. Learn about authentication, authorization, rate limiting, and data validation.",
    category: "Security",
    readTime: "16 min read",
    author: "Security Team",
    href: "#"
  },
  {
    id: "6",
    title: "Responsive Design Techniques",
    description: "Create beautiful, responsive web designs that work across all devices. Modern CSS techniques and mobile-first approaches.",
    category: "Design",
    readTime: "14 min read",
    author: "Design Team",
    href: "#"
  }
];

export function GuidesList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredGuides = selectedCategory === "All" 
    ? sampleGuides 
    : sampleGuides.filter(guide => guide.category === selectedCategory);

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
            description={guide.description}
            category={guide.category}
            readTime={guide.readTime}
            author={guide.author}
            href={guide.href}
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