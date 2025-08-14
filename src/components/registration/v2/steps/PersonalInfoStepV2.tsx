import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { User, Mail, Sparkles } from 'lucide-react';
import { useViewportResize } from '@/hooks/useViewportResize';

interface PersonalInfoStepV2Props {
  form: UseFormReturn<any>;
  data: any;
}

const USER_TYPE_OPTIONS = [
  {
    value: 'first-time',
    label: 'New to Apple',
    description: 'Just got my first Apple device',
    icon: '🌟',
  },
  {
    value: 'switching',
    label: 'Switching Platforms',
    description: 'Coming from Windows/Android',
    icon: '🔄',
  },
  {
    value: 'experienced',
    label: 'Apple User',
    description: 'Already use Apple devices',
    icon: '🍎',
  },
];

export const PersonalInfoStepV2: React.FC<PersonalInfoStepV2Props> = ({ form }) => {
  const viewport = useViewportResize();

  return (
    <div className={cn(
      "overflow-hidden", // Prevent horizontal overflow
      viewport.isSmall ? "space-y-6" : "space-y-8"
    )}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className={cn(
          "bg-accent-a/10 rounded-full flex items-center justify-center mx-auto mb-4",
          viewport.isSmall ? "w-12 h-12" : "w-16 h-16"
        )}>
          <User className={cn(
            "text-accent-a",
            viewport.isSmall ? "w-6 h-6" : "w-8 h-8"
          )} />
        </div>
        <h2 className={cn(
          "font-sf-pro font-semibold text-text",
          viewport.isSmall ? "text-lg" : "text-ios-title2"
        )}>
          Let's get to know you
        </h2>
        <p className={cn(
          "text-text-muted",
          viewport.isSmall ? "text-sm" : "text-ios-body"
        )}>
          Help us personalize your learning experience
        </p>
      </div>

      {/* Name Field */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className={cn(
              "font-sf-pro font-medium text-text",
              viewport.isSmall ? "text-sm" : "text-ios-callout"
            )}>
              Your Name
            </FormLabel>
            <FormControl>
              <div className="relative">
                <User className={cn(
                  "absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted",
                  viewport.isSmall ? "w-4 h-4" : "w-5 h-5"
                )} />
                <Input
                  {...field}
                  placeholder="Enter your full name"
                  className={cn(
                    "pl-12 pr-4 bg-surface-2 border-0 rounded-xl2",
                    "focus:ring-2 focus:ring-accent-a/30 placeholder:text-text-muted",
                    "transition-all duration-200",
                    viewport.isSmall ? "h-12 text-sm" : "h-14 text-ios-body"
                  )}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email Field */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className={cn(
              "font-sf-pro font-medium text-text",
              viewport.isSmall ? "text-sm" : "text-ios-callout"
            )}>
              Email Address
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className={cn(
                  "absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted",
                  viewport.isSmall ? "w-4 h-4" : "w-5 h-5"
                )} />
                <Input
                  {...field}
                  type="email"
                  placeholder="your@email.com"
                  className={cn(
                    "pl-12 pr-4 bg-surface-2 border-0 rounded-xl2",
                    "focus:ring-2 focus:ring-accent-a/30 placeholder:text-text-muted",
                    "transition-all duration-200",
                    viewport.isSmall ? "h-12 text-sm" : "h-14 text-ios-body"
                  )}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* User Type Selection */}
      <FormField
        control={form.control}
        name="userType"
        render={({ field }) => (
          <FormItem className={cn(
            viewport.isSmall ? "space-y-3" : "space-y-4"
          )}>
            <FormLabel className={cn(
              "font-sf-pro font-medium text-text",
              viewport.isSmall ? "text-sm" : "text-ios-callout"
            )}>
              Your Apple Experience
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className={cn(
                  viewport.isSmall ? "space-y-2" : "space-y-3"
                )}
              >
                {USER_TYPE_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex items-center rounded-xl2 bg-surface-2",
                      "border-2 border-transparent hover:bg-surface cursor-pointer",
                      "transition-all duration-200 touch-manipulation",
                      viewport.isSmall ? "space-x-3 p-3" : "space-x-4 p-4",
                      field.value === option.value && "border-accent-a bg-accent-a/5"
                    )}
                  >
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value}
                      className="sr-only"
                    />
                    <Label 
                      htmlFor={option.value}
                      className="flex items-center cursor-pointer flex-1 min-w-0"
                    >
                      <div className={cn(
                        "flex-shrink-0",
                        viewport.isSmall ? "text-lg mr-3" : "text-2xl mr-4"
                      )}>
                        {option.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "font-sf-pro font-medium text-text truncate",
                          viewport.isSmall ? "text-sm" : "text-ios-callout"
                        )}>
                          {option.label}
                        </div>
                        <div className={cn(
                          "text-text-muted",
                          viewport.isSmall ? "text-xs" : "text-ios-footnote"
                        )}>
                          {option.description}
                        </div>
                      </div>
                      {field.value === option.value && (
                        <div className={cn(
                          "bg-accent-a rounded-full flex items-center justify-center flex-shrink-0",
                          viewport.isSmall ? "w-5 h-5" : "w-6 h-6"
                        )}>
                          <div className={cn(
                            "bg-white rounded-full",
                            viewport.isSmall ? "w-1.5 h-1.5" : "w-2 h-2"
                          )} />
                        </div>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};