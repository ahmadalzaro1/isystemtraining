import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, ArrowRight } from "lucide-react";

interface GuideCardProps {
  title: string;
  description: string;
  category: string;
  readTime: string;
  author: string;
  image?: string;
  href: string;
}

export function GuideCard({
  title,
  description,
  category,
  readTime,
  author,
  image,
  href
}: GuideCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-[hsl(var(--border))]">
      {/* Image placeholder */}
      <div className="aspect-video bg-gradient-to-br from-[hsl(var(--accent-a))/0.1] to-[hsl(var(--accent-b))/0.1] border-b border-[hsl(var(--border))]">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl opacity-30">📚</div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Category Badge */}
        <Badge variant="secondary" className="text-xs font-medium">
          {category}
        </Badge>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[hsl(var(--text-strong))] group-hover:text-[hsl(var(--accent-a))] transition-colors">
            {title}
          </h3>
          <p className="text-[hsl(var(--text-muted))] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-[hsl(var(--text-muted))]">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
        </div>

        {/* CTA */}
        <Button 
          variant="ghost" 
          className="w-full justify-between group-hover:bg-[hsl(var(--accent-a))/0.1] transition-colors"
          onClick={() => window.open(href, '_blank')}
        >
          Read Guide
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
}